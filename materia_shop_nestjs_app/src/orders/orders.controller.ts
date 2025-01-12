import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderModel } from 'src/models';

@Controller('orders') // myapp.api/orders
export class OrdersController {
  @Get(':id')
  getOneOrder(@Param('id') id: OrderModel['id']) {
    return { id };
  }

  @Post() // POST /orders
  createOrder(@Body() order: OrderModel) {
    return { ...order };
  }

  @Patch(':id') // PATCH /orders/:id
  updateOrder(
    @Param('id') id: OrderModel['id'],
    @Body() updatedOrder: OrderModel,
  ) {
    return {
      id,
      ...updatedOrder,
    };
  }
}
