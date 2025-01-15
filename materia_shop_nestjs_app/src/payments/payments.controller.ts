import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentModel } from 'src/models';
import { PaymentsService } from './payments.service';

@Controller('payments') // myapp.api/payments
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id') // GET /payments/:id
  getOneOrder(@Param('id') id: PaymentModel['id']) {
    return this.paymentsService.getOnePayment(id);
  }

  @Post() // POST /payments (Crear nueva transaccion)
  createOrder(@Body() newPayment: PaymentModel) {
    return this.paymentsService.createPayment(newPayment);
  }
}
