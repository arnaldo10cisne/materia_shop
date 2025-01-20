import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import 'dotenv/config';
import { ProductModel } from 'src/models';

@Injectable()
export class ProductsService {
  private readonly dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
  private readonly table_name = process.env.PRODUCTS_TABLE_NAME;

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

  async updateProductStock(
    updates: {
      id: string;
      stock_variation: number;
      variation: 'REDUCE' | 'INCREMENT';
    }[],
  ) {
    const updatedItems = [];

    for (const update of updates) {
      const { id, stock_variation, variation } = update;

      const variationValue =
        variation === 'REDUCE'
          ? -Math.abs(stock_variation)
          : Math.abs(stock_variation);

      const command = new UpdateItemCommand({
        TableName: this.table_name,
        Key: marshall({ id }),
        UpdateExpression: 'ADD stock_amount :variationValue',
        ExpressionAttributeValues: marshall({
          ':variationValue': variationValue,
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

  async restockProducts() {
    const command = new ScanCommand({ TableName: this.table_name });
    const response = await this.dynamoDBClient.send(command);
    const list_of_products: ProductModel[] = response.Items.map((item) =>
      unmarshall(item),
    ) as ProductModel[];
    for (const product of list_of_products) {
      const key = marshall({ id: product.id });
      const updateCommand = new UpdateItemCommand({
        TableName: this.table_name,
        Key: key,
        UpdateExpression: 'SET stock_amount = :newStock',
        ExpressionAttributeValues: marshall({
          ':newStock': 20,
        }),
        ReturnValues: 'ALL_NEW',
      });
      await this.dynamoDBClient.send(updateCommand);
    }
    return {
      message: 'Products restocked succesfully!',
    };
  }
}
