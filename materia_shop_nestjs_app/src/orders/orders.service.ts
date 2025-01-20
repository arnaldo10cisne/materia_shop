import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  CartItem,
  OrderModel,
  OrderStatus,
  PaymentMethods,
  PaymentModel,
  PaymentStatus,
} from '../models';
import axios from 'axios';
import * as crypto from 'crypto';
import 'dotenv/config';

export interface createOrderParams {
  id: string;
  user_id: string;
  acceptance_token: string;
  acceptance_auth_token: string;
  address: string;
  content: CartItem[];
  creation_date: string;
  order_status: OrderStatus;
  total_order_price: number;
  customer_email: string;
  tokenized_credit_card: string;
}

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

  async createRelatedPayment(relatedOrder: createOrderParams) {
    try {
      const response = await axios.post(`${this.apiAddress}/payments`, {
        payment_amount: relatedOrder.total_order_price,
        tokenized_credit_card: relatedOrder.tokenized_credit_card,
        acceptance_token: relatedOrder.acceptance_token,
        acceptance_auth_token: relatedOrder.acceptance_auth_token,
        customer_email: relatedOrder.customer_email,
        order_id: relatedOrder.id,
        payment_method: PaymentMethods.CARD,
      });
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
      await axios.patch(`${this.apiAddress}/products`, listOfUpdates);
    } catch (error) {
      console.error('Error making PATCH request in /products:', error);
    }
  }

  async createOrder(requestBody: createOrderParams): Promise<OrderModel> {
    if (!requestBody.id) {
      requestBody.id = String(crypto.randomUUID());
    }

    const relatedPayment: PaymentModel =
      await this.createRelatedPayment(requestBody);

    if (relatedPayment?.payment_status === PaymentStatus.APPROVED) {
      requestBody.order_status = OrderStatus.COMPLETED;

      await this.updateStock(requestBody.content);
    } else {
      requestBody.order_status = OrderStatus.FAILED;
    }

    const orderToCreate: OrderModel = {
      id: requestBody.id,
      payment_id: relatedPayment.id,
      user_id: requestBody.user_id,
      acceptance_token: requestBody.acceptance_token,
      acceptance_auth_token: requestBody.acceptance_auth_token,
      address: requestBody.address,
      content: requestBody.content,
      creation_date: requestBody.creation_date,
      order_status: requestBody.order_status,
      total_order_price: requestBody.total_order_price,
    };

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(orderToCreate),
    });

    await this.dynamoDBClient.send(command);

    return orderToCreate;
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
