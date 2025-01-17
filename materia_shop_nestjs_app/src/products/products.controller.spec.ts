import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const mockProductsService = {
      findAllProducts: jest.fn(),
      findOneProduct: jest.fn(),
      updateProductStock: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllProducts', () => {
    it('should call service.findAllProducts and return the result', async () => {
      const mockProducts = [{ id: 'prod-1' }, { id: 'prod-2' }];
      jest
        .spyOn(service, 'findAllProducts')
        .mockResolvedValueOnce(mockProducts);

      const result = await controller.findAllProducts();
      expect(service.findAllProducts).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findOneProduct', () => {
    it('should call service.findOneProduct with correct ID and return the product', async () => {
      const mockProduct = { id: 'prod-1', name: 'Product #1' };
      jest.spyOn(service, 'findOneProduct').mockResolvedValueOnce(mockProduct);

      const result = await controller.findOneProduct('prod-1');
      expect(service.findOneProduct).toHaveBeenCalledWith('prod-1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateProducts', () => {
    it('should call service.updateProductStock with the given updates', async () => {
      const updates: {
        id: string;
        stock_variation: number;
        variation: 'INCREMENT' | 'REDUCE';
      }[] = [
        { id: 'prod-1', stock_variation: 5, variation: 'INCREMENT' },
        { id: 'prod-2', stock_variation: 2, variation: 'REDUCE' },
      ];
      const mockUpdatedItems = [
        { id: 'prod-1', stock_amount: 15 },
        { id: 'prod-2', stock_amount: 8 },
      ];
      jest
        .spyOn(service, 'updateProductStock')
        .mockResolvedValueOnce(mockUpdatedItems);

      const result = await controller.updateProducts(updates);
      expect(service.updateProductStock).toHaveBeenCalledWith(updates);
      expect(result).toEqual(mockUpdatedItems);
    });
  });
});
