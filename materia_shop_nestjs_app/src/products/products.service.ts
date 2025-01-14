import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class ProductsService {
  private readonly dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
  private readonly table_name = 'MateriaShop__products-table';

  async findAllProducts() {
    const command = new ScanCommand({ TableName: this.table_name });
    const response = await this.dynamoDBClient.send(command);
    return response.Items.map((item) => unmarshall(item));
  }

  async findOneProduct(id: string) {
    const command = new GetItemCommand({
      TableName: this.table_name,
      Key: marshall({ id }),
    });
    const response = await this.dynamoDBClient.send(command);
    return response.Item ? unmarshall(response.Item) : null;
  }

  async updateProducts(updates: { id: string; stock_amount?: number }[]) {
    const updatedItems = [];

    for (const update of updates) {
      const { id, stock_amount } = update;

      const command = new UpdateItemCommand({
        TableName: this.table_name,
        Key: marshall({ id }),
        UpdateExpression: 'SET stock_amount = :stock_amount',
        ExpressionAttributeValues: marshall({
          ':stock_amount': stock_amount ?? 0,
        }),
        ReturnValues: 'ALL_NEW',
      });

      const response = await this.dynamoDBClient.send(command);

      if (response.Attributes) {
        updatedItems.push(unmarshall(response.Attributes));
      }
    }

    return updatedItems;
  }

}
