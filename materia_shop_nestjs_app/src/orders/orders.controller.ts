import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderModel } from 'src/models';
import { OrdersService } from './orders.service';

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
  createOrder(@Body() newOrder: OrderModel) {
    return this.ordersService.createOrder(newOrder);
  }

  @Patch(':id')
  updateOrder(
    @Param('id') id: OrderModel['id'],
    @Body() updatedOrder: Partial<OrderModel>,
  ) {
    return this.ordersService.updateOrder(id, updatedOrder);
  }
}
