import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderModel } from 'src/models';
import { createOrderParams, OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  getOneOrder(@Param('id') id: OrderModel['id']) {
    return this.ordersService.getOneOrder(id);
  }

  @Post()
  createOrder(@Body() requestBody: createOrderParams) {
    return this.ordersService.createOrder(requestBody);
  }

  @Patch(':id')
  updateOrder(
    @Param('id') id: OrderModel['id'],
    @Body() updatedOrder: Partial<OrderModel>,
  ) {
    return this.ordersService.updateOrder(id, updatedOrder);
  }
}
