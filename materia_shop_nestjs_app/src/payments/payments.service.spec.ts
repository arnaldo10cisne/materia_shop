import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService, createPaymentParams } from './payments.service';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import axios from 'axios';
import {
  createIntegritySignature,
  getPaymentSourceId,
  getWompiTransactionId,
} from './utils/utilityFunctions';
import { PaymentMethods, PaymentModel, PaymentStatus } from '../models';

jest.mock('@aws-sdk/client-dynamodb', () => {
  const originalModule = jest.requireActual('@aws-sdk/client-dynamodb');
  return {
    ...originalModule,
    DynamoDBClient: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(),
      };
    }),
  };
});

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('./utils/utilityFunctions', () => ({
  createIntegritySignature: jest.fn(),
  getPaymentSourceId: jest.fn(),
  getWompiTransactionId: jest.fn(),
  WOMPI_SANDBOX_API: 'http://mock-wompi.api',
}));

describe('PaymentsService', () => {
  let service: PaymentsService;
  let dynamoDBClientMock: jest.Mocked<DynamoDBClient>;

  beforeEach(async () => {
    process.env.PAYMENTS_TABLE_NAME = 'MockPaymentsTable';
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    // Cast to any to access the private client
    dynamoDBClientMock = (service as any).dynamoDBClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOnePayment', () => {
    it('should return null if item does not exist', async () => {
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Item: undefined,
      });

      const result = await service.getOnePayment('nonexistent-id');
      expect(result).toBeNull();
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(GetItemCommand),
      );
    });

    it('should return a PaymentModel if item is found', async () => {
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Item: { id: { S: 'payment-123' } },
      });

      const result = await service.getOnePayment('payment-123');
      expect(result?.id).toBe('payment-123');
    });
  });

  describe('waitForTransactionResult', () => {
    it('should keep polling until the transaction status is not PENDING', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: { data: { status: 'PENDING' } } })
        .mockResolvedValueOnce({ data: { data: { status: 'APPROVED' } } });

      const status = await service.waitForTransactionResult('txn-123');
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(status).toBe('APPROVED');
    });

    it('should throw an error if axios.get fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(service.waitForTransactionResult('txn-123')).rejects.toThrow(
        'Network error',
      );
    });
  });

  describe('createPayment', () => {
    let requestBody: createPaymentParams;

    beforeEach(() => {
      // Default mock request body
      requestBody = {
        payment_amount: '10000', // Keep as string if your service expects string, or adapt as needed
        tokenized_credit_card: 'test-tokenized',
        acceptance_token: 'test-acceptance',
        acceptance_auth_token: 'test-acceptance-auth',
        customer_email: 'test@example.com',
        order_id: 'order-123',
        payment_method: PaymentMethods.CARD,
      };

      (createIntegritySignature as jest.Mock).mockResolvedValue('some-hash');
      (getPaymentSourceId as jest.Mock).mockResolvedValue(12345);
      (getWompiTransactionId as jest.Mock).mockResolvedValue('txn-xyz');
    });

    it('should create a payment and store it in DynamoDB', async () => {
      // Mock PutItem success
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({});
      // Mock final transaction status
      jest
        .spyOn(service, 'waitForTransactionResult')
        .mockResolvedValueOnce('APPROVED');

      const result = await service.createPayment(requestBody);

      // Verifications: utility functions
      expect(createIntegritySignature).toHaveBeenCalledWith({
        amount_in_cents: Number(requestBody.payment_amount),
        payment_id: expect.any(String), // the generated UUID
      });
      expect(getPaymentSourceId).toHaveBeenCalledWith({
        tokenized_credit_card: 'test-tokenized',
        acceptance_token: 'test-acceptance',
        acceptance_auth_token: 'test-acceptance-auth',
        customer_email: 'test@example.com',
      });
      expect(getWompiTransactionId).toHaveBeenCalledWith({
        amount_in_cents: Number(requestBody.payment_amount),
        customer_email: 'test@example.com',
        reference: expect.any(String),
        payment_source_id: 12345,
        integritySignature: 'some-hash',
      });
      expect(service.waitForTransactionResult).toHaveBeenCalledWith('txn-xyz');

      // Verify final PaymentModel
      expect(result).toMatchObject<Partial<PaymentModel>>({
        order_id: 'order-123',
        payment_method: PaymentMethods.CARD,
        payment_status: PaymentStatus.APPROVED,
        tokenized_credit_card: 'test-tokenized',
        wompi_transaction_id: 'txn-xyz',
      });
      // The ID should be generated
      expect(result.id).toBeDefined();

      // Confirm we wrote it to DynamoDB
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(PutItemCommand),
      );
    });

    it('should handle a non-PENDING final status (e.g., DECLINED)', async () => {
      // Suppose the final transaction is DECLINED
      jest
        .spyOn(service, 'waitForTransactionResult')
        .mockResolvedValueOnce('DECLINED');
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValue({});

      const result = await service.createPayment(requestBody);
      expect(result.payment_status).toBe('DECLINED');
    });
  });
});
