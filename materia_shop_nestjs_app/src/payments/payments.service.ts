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
  getPaymentSourceId,
  WOMPI_SANDBOX_API,
} from './utils/utilityFunctions';
import * as crypto from 'crypto';
import axios from 'axios';
import 'dotenv/config';

@Injectable()
export class PaymentsService {
  private readonly dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
  private readonly tableName = process.env.PAYMENTS_TABLE_NAME;

  async getOnePayment(id: string): Promise<PaymentModel | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({ id }),
    });
    const response = await this.dynamoDBClient.send(command);

    return response.Item ? (unmarshall(response.Item) as PaymentModel) : null;
  }

  async waitForTransactionResult(wompiTransactionId: string): Promise<string> {
    const url = `${WOMPI_SANDBOX_API}/transactions/${wompiTransactionId}`;

    while (true) {
      try {
        const response = await axios.get(url);
        const transactionStatus = response.data?.data?.status;

        if (transactionStatus !== 'PENDING') {
          return transactionStatus;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error consultando la transacción de Wompi:', error);
        throw error;
      }
    }
  }

  async createPayment(newPayment: PaymentModel): Promise<PaymentModel> {
    if (!newPayment.id) {
      newPayment.id = crypto.randomUUID();
    }

    console.log('PAYMENT: ', newPayment);

    const integritySignature = await createIntegritySignature({
      amount_in_cents: Number(newPayment.payment_amount),
      payment_id: newPayment.id,
    });

    const paymentSourceId = await getPaymentSourceId({
      tokenized_credit_card: newPayment.tokenized_credit_card,
      acceptance_token: newPayment.acceptance_token,
      acceptance_auth_token: newPayment.acceptance_auth_token,
      customer_email: newPayment.customer_email,
    });

    const wompiTransactionId = await getWompiTransactionId({
      amount_in_cents: Number(newPayment.payment_amount),
      customer_email: newPayment.customer_email,
      reference: newPayment.id,
      payment_source_id: paymentSourceId,
      integritySignature,
    });

    const wompiTransactionResult =
      await this.waitForTransactionResult(wompiTransactionId);

    newPayment.wompiTransactionId = wompiTransactionResult;

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(newPayment),
    });

    await this.dynamoDBClient.send(command);

    return newPayment;
  }
}
