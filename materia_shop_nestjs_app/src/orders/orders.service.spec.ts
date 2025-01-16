import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import axios from 'axios';
import { OrderModel, OrderStatus, PaymentStatus } from '../models';
import { marshall } from '@aws-sdk/util-dynamodb';

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

describe('OrdersService', () => {
  let service: OrdersService;
  let dynamoDBClientMock: jest.Mocked<DynamoDBClient>;

  beforeEach(async () => {
    process.env.ORDERS_TABLE_NAME = 'MockOrdersTable';
    process.env.NESTJS_API_ADDRESS = 'http://mock-api.local';

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);

    dynamoDBClientMock = (service as any).dynamoDBClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should return an empty array if no items are in the table', async () => {
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Items: [],
      });

      const result = await service.getAllOrders();
      expect(result).toEqual([]);
      expect(dynamoDBClientMock.send).toHaveBeenCalledTimes(1);
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(ScanCommand),
      );
    });

    it('should return a list of OrderModels when items exist', async () => {
      const mockItem = { id: { S: 'order-1' }, user_id: { S: 'user-1' } };
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Items: [mockItem],
      });

      const result = await service.getAllOrders();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ id: 'order-1', user_id: 'user-1' });
    });
  });

  describe('getOneOrder', () => {
    it('should return null if the item does not exist', async () => {
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Item: undefined,
      });

      const result = await service.getOneOrder('non-existent');
      expect(result).toBeNull();
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(GetItemCommand),
      );
    });

    it('should return the OrderModel if the item exists', async () => {
      const mockItem = { id: { S: 'order-123' } };
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Item: mockItem,
      });

      const result = await service.getOneOrder('order-123');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('order-123');
    });
  });

  describe('createRelatedPayment', () => {
    it('should call axios.post with the correct payload and return response data', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true, wompiTransactionId: 'abc123' },
      });

      const mockOrder: OrderModel = {
        id: 'order-1',
        user_id: 'user-1',
        address: 'Mock Address',
        creation_date: '02/28',
        content: [],
        order_status: OrderStatus.PENDING,
        payment_method: {
          id: 'pay-1',
          tokenized_credit_card: 'tok-abc',
          payment_status: PaymentStatus.PENDING,
          customer_email: 'test@example.com',
          payment_amount: '1000',
          order: null,
        },
        total_order_price: 1000,
      };

      const result = await service.createRelatedPayment(mockOrder);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://mock-api.local/payments',
        expect.objectContaining({
          id: 'pay-1',
          tokenized_credit_card: 'tok-abc',
          payment_amount: 1000,
        }),
      );
      expect(result).toEqual({ success: true, wompiTransactionId: 'abc123' });
    });

    it('should log an error if the request fails and return undefined', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.createRelatedPayment({} as any);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error making POST request in /payments:',
        expect.any(Error),
      );
      expect(result).toBeUndefined();
    });
  });

  describe('updateStock', () => {
    it('should patch products with the correct data', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { updated: true } });
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const mockCartItems = [
        { id: 'item-1', product: 'prod-1', amount: 2 },
        { id: 'item-2', product: 'prod-2', amount: 3 },
      ];

      await service.updateStock(mockCartItems);
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        'http://mock-api.local/products',
        [
          { id: 'prod-1', stock_variation: 2, variation: 'REDUCE' },
          { id: 'prod-2', stock_variation: 3, variation: 'REDUCE' },
        ],
      );
      expect(consoleLogSpy).toHaveBeenCalledWith('Stock updated:', {
        updated: true,
      });
    });

    it('should log an error if the patch request fails', async () => {
      mockedAxios.patch.mockRejectedValueOnce(new Error('Patch Error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.updateStock([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error making PATCH request in /products:',
        expect.any(Error),
      );
    });
  });

  describe('createOrder', () => {
    it('should generate a UUID if newOrder.id is not provided', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        payment_status: PaymentStatus.APPROVED,
        wompiTransactionId: '123456789',
      });
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValue({});

      const newOrder: OrderModel = {
        id: '',
        user_id: 'user-X',
        address: 'Some Address',
        creation_date: '02/28',
        content: [],
        order_status: OrderStatus.PENDING,
        payment_method: {
          id: 'pay-123',
          tokenized_credit_card: 'tok-123',
          payment_status: PaymentStatus.PENDING,
          customer_email: 'email@example.com',
          payment_amount: '1000',
          order: null,
        },
        total_order_price: 1000,
      };

      const createdOrder = await service.createOrder(newOrder);
      expect(createdOrder.id).toBeDefined();
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(PutItemCommand),
      );
    });

    it('should set order_status to FAILED if the payment is not APPROVED', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { payment_status: PaymentStatus.FAILED },
      });
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValue({});

      const orderWithoutId: OrderModel = {
        user_id: 'user-X',
        address: 'Another Address',
        creation_date: '02/28',
        content: [],
        order_status: OrderStatus.PENDING,
        payment_method: {
          id: 'pay-456',
          tokenized_credit_card: 'tok-456',
          payment_status: PaymentStatus.PENDING,
          customer_email: 'test@example.com',
          payment_amount: '2000',
          order: null,
        },
        total_order_price: 2000,
      } as any;

      const createdOrder = await service.createOrder(orderWithoutId);
      expect(createdOrder.order_status).toBe(OrderStatus.FAILED);
    });
  });

  describe('updateOrder', () => {
    it('should update the provided fields and return the updated order', async () => {
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Attributes: marshall({
          id: 'order-123',
          address: 'New Address',
          order_status: 'PENDING',
        }),
      });

      const updatedData = { address: 'New Address' };
      const result = await service.updateOrder('order-123', updatedData);
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(UpdateItemCommand),
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: 'order-123',
          address: 'New Address',
        }),
      );
    });

    it('should return null if no attributes are returned', async () => {
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Attributes: undefined,
      });

      const result = await service.updateOrder('non-existent', {
        address: '123',
      });
      expect(result).toBeNull();
    });
  });
});
