import { Controller, Get, Param } from '@nestjs/common';
import { ProductModel } from 'src/models';

@Controller('products') // myapp.api/products
export class ProductsController {
  @Get() // GET /products/
  getAllProducts() {
    return [];
  }

  @Get(':id') // GET /products/:id
  getSingleProduct(@Param('id') id: ProductModel['id']) {
    return { id };
  }

  // @Patch(':id') // PATCH /products/:id
  // updateUser(@Param('id') id: string, @Body() updatedProduct: {}) {
  //   return {
  //     id,
  //     ...updatedProduct,
  //   };
  // }
}
