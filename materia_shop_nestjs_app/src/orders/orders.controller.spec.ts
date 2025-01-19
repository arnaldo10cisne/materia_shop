import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService, createOrderParams } from './orders.service';
import { OrderModel, OrderStatus } from '../models';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    // Create a mock OrdersService
    const mockOrdersService = {
      getAllOrders: jest.fn(),
      getOneOrder: jest.fn(),
      createOrder: jest.fn(),
      updateOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should call OrdersService.getAllOrders and return its result', async () => {
      const mockResult: OrderModel[] = [
        {
          id: 'order-1',
          user_id: 'user-1',
          address: '123 Main St',
          creation_date: '2025-01-01',
          content: [],
          order_status: OrderStatus.PENDING,
          payment_id: 'payment-1',
          total_order_price: 1000,
        },
      ];

      jest.spyOn(service, 'getAllOrders').mockResolvedValueOnce(mockResult);

      const result = await controller.getAllOrders();
      expect(service.getAllOrders).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getOneOrder', () => {
    it('should call OrdersService.getOneOrder with the correct ID and return the order', async () => {
      const mockId = 'order-1';
      const mockOrder: OrderModel = {
        id: mockId,
        user_id: 'user-1',
        address: '123 Main St',
        creation_date: '2025-01-01',
        content: [],
        order_status: OrderStatus.PENDING,
        payment_id: 'payment-123',
        total_order_price: 1000,
      };

      jest.spyOn(service, 'getOneOrder').mockResolvedValueOnce(mockOrder);

      const result = await controller.getOneOrder(mockId);
      expect(service.getOneOrder).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('createOrder', () => {
    it('should call OrdersService.createOrder with the correct data and return the created order', async () => {
      // This is what the controller receives:
      const newOrderParams: createOrderParams = {
        id: '',
        user_id: 'user-2',
        acceptance_token: 'accept-token-123',
        acceptance_auth_token: 'auth-token-456',
        address: '456 Another St',
        content: [],
        creation_date: '2025-01-02',
        order_status: OrderStatus.PENDING,
        total_order_price: 2000,
        customer_email: 'user2@example.com',
        tokenized_credit_card: 'tok-abc123',
      };

      // This is the OrderModel the service will return:
      const createdOrder: OrderModel = {
        id: 'order-2',
        user_id: 'user-2',
        payment_id: 'payment-xyz',
        address: '456 Another St',
        creation_date: '2025-01-02',
        content: [],
        order_status: OrderStatus.COMPLETED,
        total_order_price: 2000,
      };

      jest.spyOn(service, 'createOrder').mockResolvedValueOnce(createdOrder);

      const result = await controller.createOrder(newOrderParams);
      expect(service.createOrder).toHaveBeenCalledWith(newOrderParams);
      expect(result).toEqual(createdOrder);
    });
  });

  describe('updateOrder', () => {
    it('should call OrdersService.updateOrder with the correct ID and updated data, and return the updated order', async () => {
      const mockId = 'order-3';
      const updatedData = { address: 'New address' };
      const updatedOrder: OrderModel = {
        id: mockId,
        user_id: 'user-3',
        address: 'New address',
        creation_date: '2025-01-03',
        content: [],
        order_status: OrderStatus.PENDING,
        payment_id: 'payment-3',
        total_order_price: 3000,
      };

      jest.spyOn(service, 'updateOrder').mockResolvedValueOnce(updatedOrder);

      const result = await controller.updateOrder(mockId, updatedData);
      expect(service.updateOrder).toHaveBeenCalledWith(mockId, updatedData);
      expect(result).toEqual(updatedOrder);
    });
  });
});
