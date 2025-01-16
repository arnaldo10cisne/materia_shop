import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { PaymentModel, PaymentStatus } from '../models';
import axios from 'axios';

// Utility functions to mock:
import {
  createIntegritySignature,
  getPaymentSourceId,
  getWompiTransactionId,
} from './utils/utilityFunctions';

// 1) Mock the AWS SDK client so no real calls occur
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

// 2) Mock axios so no real HTTP calls occur
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// 3) Mock the utility functions
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
    process.env.PAYMENTS_TABLE_NAME = 'MockPaymentsTable'; // or any test value

    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);

    // Extract the mocked DynamoDBClient from the service
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
      // First response is PENDING, second is APPROVED
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
    beforeEach(() => {
      // Make sure these mocks return something by default
      (createIntegritySignature as jest.Mock).mockResolvedValue('some-hash');
      (getPaymentSourceId as jest.Mock).mockResolvedValue(12345);
      (getWompiTransactionId as jest.Mock).mockResolvedValue('txn-xyz');
    });

    it('should generate an ID if not provided', async () => {
      // Mock waitForTransactionResult
      jest
        .spyOn(service, 'waitForTransactionResult')
        .mockResolvedValue('APPROVED');
      // Mock the DynamoDB put
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValue({});

      const payment: PaymentModel = {
        id: '',
        tokenized_credit_card: 'tok-abc',
        customer_email: 'test@example.com',
        payment_amount: '5000',
        payment_status: PaymentStatus.PENDING,
        acceptance_token: 'abc',
        acceptance_auth_token: 'def',
      };

      const result = await service.createPayment(payment);
      expect(result.id).toBeDefined(); // auto-generated
      expect(result.payment_status).toBe(PaymentStatus.APPROVED);
      expect(result.wompiTransactionId).toBe('txn-xyz');
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(PutItemCommand),
      );
    });

    it('should keep the existing ID if already provided', async () => {
      jest
        .spyOn(service, 'waitForTransactionResult')
        .mockResolvedValue('DECLINED');
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValue({});

      const payment: PaymentModel = {
        id: 'existing-id',
        tokenized_credit_card: 'tok-xyz',
        customer_email: 'some@example.com',
        payment_amount: '1000',
        payment_status: PaymentStatus.PENDING,
      };

      const result = await service.createPayment(payment);
      expect(result.id).toBe('existing-id');
      expect(result.payment_status).toBe('DECLINED');
    });
  });
});
