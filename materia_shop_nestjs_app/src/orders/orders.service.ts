import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { CartItem, OrderModel, OrderStatus, PaymentStatus } from 'src/models';
import axios from 'axios';
import * as crypto from 'crypto';
import 'dotenv/config';

@Injectable()
export class OrdersService {
  private readonly dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
  private readonly tableName = process.env.ORDERS_TABLE_NAME;
  private readonly apiAddress = process.env.NESTJS_API_ADDRESS;

  async getAllOrders(): Promise<OrderModel[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });
    const response = await this.dynamoDBClient.send(command);

    return response.Items?.map((item) => unmarshall(item) as OrderModel) || [];
  }

  async createRelatedPayment(relatedOrder: OrderModel) {
    try {
      const response = await axios.post(`${this.apiAddress}/payments`, {
        id: relatedOrder.payment_method.id,
        tokenized_credit_card:
          relatedOrder.payment_method.tokenized_credit_card,
        payment_status: relatedOrder.payment_method.payment_status,
        customer_email: relatedOrder.payment_method.customer_email,
        payment_amount: relatedOrder.total_order_price,
        order: relatedOrder.id,
        acceptance_auth_token: relatedOrder.acceptance_auth_token,
        acceptance_token: relatedOrder.acceptance_token,
      });
      console.log('createRelatedPayment Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error making POST request in /payments:', error);
    }
  }

  async getOneOrder(id: string): Promise<OrderModel | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });
    const response = await this.dynamoDBClient.send(command);

    return response.Item ? (unmarshall(response.Item) as OrderModel) : null;
  }

  async updateStock(listOfItems: CartItem[]) {
    const listOfUpdates: {
      id: string;
      stock_variation: number;
      variation: 'REDUCE' | 'INCREMENT';
    }[] = [];
    for (const item of listOfItems) {
      listOfUpdates.push({
        id: item.product,
        stock_variation: item.amount,
        variation: 'REDUCE',
      });
    }

    try {
      const response = await axios.patch(
        `${this.apiAddress}/products`,
        listOfUpdates,
      );
      console.log('Stock updated:', response.data);
    } catch (error) {
      console.error('Error making PATCH request in /products:', error);
    }
  }

  async createOrder(newOrder: OrderModel): Promise<OrderModel> {
    if (!newOrder.id) {
      newOrder.id = String(crypto.randomUUID());
    }

    console.log('ORDER: ', newOrder);

    const relatedPayment = await this.createRelatedPayment(newOrder);

    if (relatedPayment.wompiTransactionId === PaymentStatus.APPROVED) {
      newOrder.order_status = OrderStatus.COMPLETED;

      await this.updateStock(newOrder.content);
    } else {
      newOrder.order_status = OrderStatus.FAILED;
    }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(newOrder),
    });

    await this.dynamoDBClient.send(command);

    return newOrder;
  }

  async updateOrder(
    id: string,
    updatedOrder: Partial<OrderModel>,
  ): Promise<OrderModel | null> {
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};

    for (const [key, value] of Object.entries(updatedOrder)) {
      if (key === 'id') continue;

      updateExpressions.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = value;
    }

    if (updateExpressions.length === 0) {
      return this.getOneOrder(id);
    }

    const updateExpression = `SET ${updateExpressions.join(', ')}`;

    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
      ReturnValues: 'ALL_NEW',
    });

    const response = await this.dynamoDBClient.send(command);
    return response.Attributes
      ? (unmarshall(response.Attributes) as OrderModel)
      : null;
  }
}
