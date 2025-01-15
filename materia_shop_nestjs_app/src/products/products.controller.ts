import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products') // myapp.api/products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get() // GET /products/
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Get(':id') // GET /products/:id
  findOneProduct(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @Patch() // PATCH /products/
  async updateProducts(
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
