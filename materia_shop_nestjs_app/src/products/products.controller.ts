import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Get('restock')
  restockProducts() {
    return this.productsService.restockProducts();
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @Patch()
  updateProducts(
    @Body()
    updates: {
      id: string;
      stock_variation: number;
      variation: 'REDUCE' | 'INCREMENT';
    }[],
  ) {
    return this.productsService.updateProductStock(updates);
  }
}
