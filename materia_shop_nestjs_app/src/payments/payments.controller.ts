import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentModel } from 'src/models';

@Controller('payments') // myapp.api/payments
export class PaymentsController {
  @Get(':id')
  getOnePayment(@Param('id') id: PaymentModel['id']) {
    return { id };
  }

  @Post() // POST /payments
  createPayment(@Body() payment: PaymentModel) {
    return { ...payment };
  }
}
