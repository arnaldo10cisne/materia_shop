import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService, createPaymentParams } from './payments.service';
import { PaymentModel, PaymentStatus, PaymentMethods } from '../models';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    // Create a mock PaymentsService
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
        tokenized_credit_card: 'tok-xyz',
        payment_status: PaymentStatus.PENDING,
        order_id: 'order-abc',
        payment_method: PaymentMethods.CARD,
        wompi_transaction_id: 'txn-111',
      };

      jest.spyOn(service, 'getOnePayment').mockResolvedValueOnce(mockPayment);

      const result = await controller.getOneOrder('payment-123');
      expect(service.getOnePayment).toHaveBeenCalledWith('payment-123');
      expect(result).toBe(mockPayment);
    });
  });

  describe('createOrder', () => {
    it('should call PaymentsService.createPayment with the correct data and return the created payment', async () => {
      // This is what the controller (via @Body) expects: createPaymentParams
      const newPaymentParams: createPaymentParams = {
        payment_amount: '2000',
        tokenized_credit_card: 'tok-abc',
        acceptance_token: 'accept-token-123',
        acceptance_auth_token: 'auth-token-456',
        customer_email: 'email@example.com',
        order_id: 'order-xyz',
        payment_method: PaymentMethods.CARD,
      };

      // This is what the PaymentsService will return: a PaymentModel
      const createdPayment: PaymentModel = {
        id: 'generated-uuid',
        tokenized_credit_card: 'tok-abc',
        payment_status: PaymentStatus.APPROVED,
        order_id: 'order-xyz',
        payment_method: PaymentMethods.CARD,
        wompi_transaction_id: 'txn-123',
      };

      jest
        .spyOn(service, 'createPayment')
        .mockResolvedValueOnce(createdPayment);

      const result = await controller.createOrder(newPaymentParams);
      expect(service.createPayment).toHaveBeenCalledWith(newPaymentParams);
      expect(result).toBe(createdPayment);
    });
  });
});
