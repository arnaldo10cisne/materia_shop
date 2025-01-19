import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { PaymentMethods, PaymentModel, PaymentStatus } from 'src/models';
import {
  createIntegritySignature,
  getWompiTransactionId,
  getPaymentSourceId,
  WOMPI_SANDBOX_API,
} from './utils/utilityFunctions';
import * as crypto from 'crypto';
import axios from 'axios';
import 'dotenv/config';

export interface createPaymentParams {
  payment_amount: string;
  tokenized_credit_card: string;
  acceptance_token: string;
  acceptance_auth_token: string;
  customer_email: string;
  order_id: string;
  payment_method: PaymentMethods;
}

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

  async createPayment(requestBody: createPaymentParams): Promise<PaymentModel> {
    const paymentToCreateId = crypto.randomUUID();

    const integritySignature = await createIntegritySignature({
      amount_in_cents: Number(requestBody.payment_amount),
      payment_id: paymentToCreateId,
    });

    const paymentSourceId = await getPaymentSourceId({
      tokenized_credit_card: requestBody.tokenized_credit_card,
      acceptance_token: requestBody.acceptance_token,
      acceptance_auth_token: requestBody.acceptance_auth_token,
      customer_email: requestBody.customer_email,
    });

    const wompiTransactionId = await getWompiTransactionId({
      amount_in_cents: Number(requestBody.payment_amount),
      customer_email: requestBody.customer_email,
      reference: paymentToCreateId,
      payment_source_id: paymentSourceId,
      integritySignature,
    });

    const wompiTransactionResult =
      await this.waitForTransactionResult(wompiTransactionId);

    const paymentToCreate: PaymentModel = {
      id: paymentToCreateId,
      order_id: requestBody.order_id,
      payment_status: wompiTransactionResult as PaymentStatus,
      payment_method: requestBody.payment_method,
      tokenized_credit_card: requestBody.tokenized_credit_card,
      wompi_transaction_id: wompiTransactionId,
    };

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(paymentToCreate),
    });

    await this.dynamoDBClient.send(command);

    return paymentToCreate;
  }
}
