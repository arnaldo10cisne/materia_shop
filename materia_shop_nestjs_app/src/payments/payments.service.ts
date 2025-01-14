import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { PaymentModel } from 'src/models';

@Injectable()
export class PaymentsService {
  private readonly dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
  private readonly tableName = 'MateriaShop__payments-table';

  async getOnePayment(id: string): Promise<PaymentModel | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });
    const response = await this.dynamoDBClient.send(command);

    return response.Item ? (unmarshall(response.Item) as PaymentModel) : null;
  }

  async createPayment(newPayment: PaymentModel): Promise<PaymentModel> {
    if (!newPayment.id) {
      newPayment.id = crypto.randomUUID();
    }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(newPayment),
    });

    await this.dynamoDBClient.send(command);

    //CALL WOMPI API

    return newPayment;
  }
}
