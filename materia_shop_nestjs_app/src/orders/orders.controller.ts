import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderModel } from 'src/models';
import { OrdersService } from './orders.service';

@Controller('orders') // myapp.api/orders
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get() // GET /orders
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id') // GET /orders/:id
  getOneOrder(@Param('id') id: OrderModel['id']) {
    return this.ordersService.getOneOrder(id);
  }

  @Post() // POST /orders (Crear nueva orden)
  createOrder(@Body() newOrder: OrderModel) {
    return this.ordersService.createOrder(newOrder);
  }

  @Patch(':id') // PATCH /orders/:id
  updateOrder(
    @Param('id') id: OrderModel['id'],
    @Body() updatedOrder: Partial<OrderModel>,
  ) {
    return this.ordersService.updateOrder(id, updatedOrder);
  }
}
