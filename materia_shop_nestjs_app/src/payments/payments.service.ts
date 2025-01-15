import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { PaymentModel } from 'src/models';
import {
  createIntegritySignature,
  getWompiTransactionId,
  getAcceptanceTokens,
  getPaymentSourceId,
} from './utils/utilityFunctions';
import * as crypto from 'crypto';

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

    const integritySignature = await createIntegritySignature({
      amount_in_cents: Number(newPayment.payment_amount),
      payment_id: newPayment.id,
    });

    const [acceptance_token, acceptance_auth_token] =
      await getAcceptanceTokens();

    const paymentSourceId = await getPaymentSourceId({
      tokenized_credit_card: newPayment.tokenized_credit_card,
      acceptance_token: acceptance_token,
      acceptance_auth_token: acceptance_auth_token,
      customer_email: newPayment.customer_email,
    });

    const wompiTransactionId = await getWompiTransactionId({
      amount_in_cents: Number(newPayment.payment_amount),
      customer_email: newPayment.customer_email,
      reference: newPayment.id,
      payment_source_id: paymentSourceId,
      integritySignature,
    });

    newPayment.wompiTransactionId = wompiTransactionId;

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(newPayment),
    });

    await this.dynamoDBClient.send(command);

    return newPayment;
  }
}
