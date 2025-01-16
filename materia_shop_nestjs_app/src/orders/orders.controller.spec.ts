import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderModel, OrderStatus } from '../models';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
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
          creation_date: '02/28',
          content: [],
          order_status: OrderStatus.PENDING,
          payment_method: null,
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
        creation_date: '02/28',
        content: [],
        order_status: OrderStatus.PENDING,
        payment_method: null,
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
      const newOrder: OrderModel = {
        id: 'order-2',
        user_id: 'user-2',
        address: '456 Another St',
        creation_date: '02/28',
        content: [],
        order_status: OrderStatus.PENDING,
        payment_method: null,
        total_order_price: 2000,
      };

      jest.spyOn(service, 'createOrder').mockResolvedValueOnce(newOrder);

      const result = await controller.createOrder(newOrder);
      expect(service.createOrder).toHaveBeenCalledWith(newOrder);
      expect(result).toEqual(newOrder);
    });
  });

  describe('updateOrder', () => {
    it('should call OrdersService.updateOrder with the correct ID and updated data, and return the updated order', async () => {
      const mockId = 'order-3';
      const updatedData = { address: 'New address' };
      const updatedOrder: OrderModel = {
        id: mockId,
        user_id: 'user-3',
        address: updatedData.address,
        creation_date: '02/28',
        content: [],
        order_status: OrderStatus.PENDING,
        payment_method: null,
        total_order_price: 3000,
      };

      jest.spyOn(service, 'updateOrder').mockResolvedValueOnce(updatedOrder);

      const result = await controller.updateOrder(mockId, updatedData);
      expect(service.updateOrder).toHaveBeenCalledWith(mockId, updatedData);
      expect(result).toEqual(updatedOrder);
    });
  });
});
