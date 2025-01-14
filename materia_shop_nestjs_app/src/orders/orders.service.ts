import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { OrderModel } from 'src/models';

@Injectable()
export class OrdersService {
  private readonly dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
  private readonly tableName = 'MateriaShop__orders-table';

  async getAllOrders(): Promise<OrderModel[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });
    const response = await this.dynamoDBClient.send(command);

    return response.Items?.map((item) => unmarshall(item) as OrderModel) || [];
  }

  async getOneOrder(id: string): Promise<OrderModel | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });
    const response = await this.dynamoDBClient.send(command);

    return response.Item ? (unmarshall(response.Item) as OrderModel) : null;
  }

  async createOrder(newOrder: OrderModel): Promise<OrderModel> {
    if (!newOrder.id) {
      newOrder.id = crypto.randomUUID();
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
