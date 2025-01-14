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

  /**
   * Devuelve todas las órdenes (Scan de DynamoDB).
   */
  async getAllOrders(): Promise<OrderModel[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });
    const response = await this.dynamoDBClient.send(command);

    return response.Items?.map((item) => unmarshall(item) as OrderModel) || [];
  }

  /**
   * Devuelve una sola orden con el ID especificado (GetItem de DynamoDB).
   */
  async getOneOrder(id: string): Promise<OrderModel | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });
    const response = await this.dynamoDBClient.send(command);

    return response.Item ? (unmarshall(response.Item) as OrderModel) : null;
  }

  /**
   * Crea una nueva orden (PutItem de DynamoDB).
   * Es buena práctica generar tú mismo el ID, si tu OrderModel no lo trae ya.
   */
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

  /**
   * Actualiza una orden existente (UpdateItem de DynamoDB).
   */
  async updateOrder(
    id: string,
    updatedOrder: Partial<OrderModel>,
  ): Promise<OrderModel | null> {
    // Construimos dinámicamente la UpdateExpression y ExpressionAttributeValues
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};

    // Se recorren las claves del objeto parcial para actualizar los campos necesarios
    for (const [key, value] of Object.entries(updatedOrder)) {
      // Evitamos actualizar el campo `id` si llegara a venir en el body
      if (key === 'id') continue;

      updateExpressions.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = value;
    }

    if (updateExpressions.length === 0) {
      // Si no hay nada que actualizar, se retorna la orden original o un mensaje.
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
