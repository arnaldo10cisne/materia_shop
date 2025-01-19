import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService, createOrderParams } from './orders.service';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import axios from 'axios';
import { marshall } from '@aws-sdk/util-dynamodb';
import {
  CartItem,
  OrderModel,
  OrderStatus,
  PaymentStatus,
  PaymentMethods,
  PaymentModel,
} from '../models';

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
    // Cast to `any` to access the private `dynamoDBClient`
    dynamoDBClientMock = (service as any).dynamoDBClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should return an empty array if no items are found', async () => {
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
    it('should call axios.post with the correct payload and return the response data', async () => {
      // Mock server response for a created Payment
      const mockPaymentResponse: PaymentModel = {
        id: 'payment-xyz',
        tokenized_credit_card: 'tok-abc',
        payment_status: PaymentStatus.APPROVED,
        payment_method: PaymentMethods.CARD,
        wompi_transaction_id: 'wompi-123',
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockPaymentResponse });

      // Create an object matching createOrderParams
      const mockOrderParams: createOrderParams = {
        id: 'order-1',
        user_id: 'user-1',
        acceptance_token: 'acceptance-foo',
        acceptance_auth_token: 'acceptance-auth-bar',
        address: '123 Main St',
        content: [],
        creation_date: '2025-01-01',
        order_status: OrderStatus.PENDING,
        total_order_price: 1000,
        customer_email: 'test@example.com',
        tokenized_credit_card: 'tok-abc',
      };

      const result = await service.createRelatedPayment(mockOrderParams);

      // If your code sends payment_amount as a string, update to expect '1000'
      // If your code sends it as a number, expect 1000
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://mock-api.local/payments',
        expect.objectContaining({
          payment_amount: 1000, // or '1000' depending on your actual service code
          tokenized_credit_card: 'tok-abc',
          acceptance_token: 'acceptance-foo',
          acceptance_auth_token: 'acceptance-auth-bar',
          customer_email: 'test@example.com',
          order_id: 'order-1',
          payment_method: PaymentMethods.CARD,
        }),
      );
      expect(result).toEqual(mockPaymentResponse);
    });

    it('should log an error and return undefined if the request fails', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.createRelatedPayment({
        // minimal object to satisfy createOrderParams
        id: 'order-1',
        user_id: 'user-1',
        acceptance_token: 'abc',
        acceptance_auth_token: 'xyz',
        address: 'Some Address',
        content: [],
        creation_date: '2025-01-01',
        order_status: OrderStatus.PENDING,
        total_order_price: 100,
        customer_email: 'fail@example.com',
        tokenized_credit_card: 'tok-fail',
      });
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

      const cartItems: CartItem[] = [
        { id: 'cart-1', product: 'prod-1', amount: 2 },
        { id: 'cart-2', product: 'prod-2', amount: 3 },
      ];

      await service.updateStock(cartItems);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        'http://mock-api.local/products',
        [
          { id: 'prod-1', stock_variation: 2, variation: 'REDUCE' },
          { id: 'prod-2', stock_variation: 3, variation: 'REDUCE' },
        ],
      );
    });

    it('should log an error if the patch request fails', async () => {
      mockedAxios.patch.mockRejectedValueOnce(new Error('Patch Error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.updateStock([
        { id: 'cart-1', product: 'prod-1', amount: 2 },
      ]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error making PATCH request in /products:',
        expect.any(Error),
      );
    });
  });

  describe('createOrder', () => {
    it('should generate a UUID if requestBody.id is not provided and payment is approved', async () => {
      // Payment is approved
      const mockPayment: PaymentModel = {
        id: 'payment-xyz',
        tokenized_credit_card: 'tok-abc',
        payment_status: PaymentStatus.APPROVED,
        payment_method: PaymentMethods.CARD,
        wompi_transaction_id: 'wompi-123',
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockPayment });

      // Mock the DB put call
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValue({});

      const newOrderParams: createOrderParams = {
        id: '', // intentionally empty to trigger UUID generation
        user_id: 'user-1',
        acceptance_token: 'accept-123',
        acceptance_auth_token: 'auth-123',
        address: '789 New Road',
        content: [{ id: 'cart-1', product: 'prod-123', amount: 1 }],
        creation_date: '2025-01-02',
        order_status: OrderStatus.PENDING,
        total_order_price: 500,
        customer_email: 'approved@example.com',
        tokenized_credit_card: 'tok-abc',
      };

      const createdOrder = await service.createOrder(newOrderParams);

      // Expect a new UUID, so just check it's not empty
      expect(createdOrder.id).toBeTruthy();
      expect(createdOrder.order_status).toBe(OrderStatus.COMPLETED);
      expect(createdOrder.payment_id).toBe('payment-xyz');
      expect(mockedAxios.patch).toHaveBeenCalledTimes(1); // stock updated

      // Confirm the order got saved to DynamoDB
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(PutItemCommand),
      );
    });

    it('should set order_status to FAILED if the payment is not approved', async () => {
      // Payment fails
      const mockPayment: PaymentModel = {
        id: 'payment-fail',
        tokenized_credit_card: 'tok-xxx',
        payment_status: PaymentStatus.FAILED,
        payment_method: PaymentMethods.CARD,
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockPayment });
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValue({});

      const newOrderParams: createOrderParams = {
        id: 'order-fail',
        user_id: 'user-fail',
        acceptance_token: 'accept-fail',
        acceptance_auth_token: 'auth-fail',
        address: 'No Stock Rd',
        content: [{ id: 'cart-1', product: 'prod-999', amount: 1 }],
        creation_date: '2025-01-03',
        order_status: OrderStatus.PENDING,
        total_order_price: 1000,
        customer_email: 'fail@example.com',
        tokenized_credit_card: 'tok-xxx',
      };

      const createdOrder = await service.createOrder(newOrderParams);

      expect(createdOrder.id).toBe('order-fail');
      expect(createdOrder.order_status).toBe(OrderStatus.FAILED);
      expect(createdOrder.payment_id).toBe('payment-fail');

      // Should NOT update the stock if payment fails
      expect(mockedAxios.patch).not.toHaveBeenCalled();

      // Confirm the order got saved with FAILED status
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(PutItemCommand),
      );
    });
  });

  describe('updateOrder', () => {
    it('should update the provided fields and return the updated order', async () => {
      // Mock the DB update
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Attributes: marshall({
          id: 'order-123',
          address: 'Updated Address',
          order_status: OrderStatus.PENDING,
          payment_id: 'payment-123',
          user_id: 'user-123',
          creation_date: '2025-01-01',
          content: [],
          total_order_price: 999,
        }),
      });

      const partialUpdate: Partial<OrderModel> = {
        address: 'Updated Address',
      };

      const result = await service.updateOrder('order-123', partialUpdate);

      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(UpdateItemCommand),
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: 'order-123',
          address: 'Updated Address',
          order_status: 'PENDING',
        }),
      );
    });

    it('should return null if no attributes are returned after update', async () => {
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Attributes: undefined,
      });

      const result = await service.updateOrder('non-existent', {
        address: 'No Address',
      });
      expect(result).toBeNull();
    });
  });
});
