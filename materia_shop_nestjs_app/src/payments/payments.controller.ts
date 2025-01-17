import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentModel } from 'src/models';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id')
  getOneOrder(@Param('id') id: PaymentModel['id']) {
    return this.paymentsService.getOnePayment(id);
  }

  @Post()
  createOrder(@Body() newPayment: PaymentModel) {
    return this.paymentsService.createPayment(newPayment);
  }
}
