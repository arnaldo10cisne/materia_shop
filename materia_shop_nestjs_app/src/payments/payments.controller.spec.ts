import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentModel, PaymentStatus } from '../models';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    // Create a mock for PaymentsService methods
    const mockPaymentsService = {
      getOnePayment: jest.fn(),
      createPayment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOneOrder', () => {
    it('should call PaymentsService.getOnePayment with the correct ID and return its result', async () => {
      const mockPayment: PaymentModel = {
        id: 'payment-123',
        tokenized_credit_card: '',
        customer_email: 'test@example.com',
        payment_amount: '1000',
        payment_status: PaymentStatus.PENDING,
        order: 'orderId',
      };
      jest.spyOn(service, 'getOnePayment').mockResolvedValueOnce(mockPayment);

      const result = await controller.getOneOrder('payment-123');
      expect(service.getOnePayment).toHaveBeenCalledWith('payment-123');
      expect(result).toBe(mockPayment);
    });
  });

  describe('createOrder', () => {
    it('should call PaymentsService.createPayment with the correct data and return the created payment', async () => {
      const newPayment: PaymentModel = {
        id: '',
        tokenized_credit_card: 'tok-abc',
        customer_email: 'email@example.com',
        payment_amount: '2000',
        payment_status: PaymentStatus.PENDING,
        order: 'orderId',
      };
      const createdPayment: PaymentModel = {
        ...newPayment,
        id: 'generated-uuid',
        payment_status: PaymentStatus.APPROVED,
      };

      jest
        .spyOn(service, 'createPayment')
        .mockResolvedValueOnce(createdPayment);

      const result = await controller.createOrder(newPayment);
      expect(service.createPayment).toHaveBeenCalledWith(newPayment);
      expect(result).toBe(createdPayment);
    });
  });
});
