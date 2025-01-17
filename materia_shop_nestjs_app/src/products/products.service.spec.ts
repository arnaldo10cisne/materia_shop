import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

jest.mock('@aws-sdk/client-dynamodb', () => {
  const originalModule = jest.requireActual('@aws-sdk/client-dynamodb');
  return {
    ...originalModule,
    DynamoDBClient: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn(),
      };
    }),
  };
});

describe('ProductsService', () => {
  let service: ProductsService;
  let dynamoDBClientMock: jest.Mocked<DynamoDBClient>;

  beforeEach(async () => {
    process.env.PRODUCTS_TABLE_NAME = 'MockProductsTable';

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    dynamoDBClientMock = (service as any).dynamoDBClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllProducts', () => {
    it('should return an array of products', async () => {
      const mockItem = { id: { S: 'prod-1' }, name: { S: 'Product #1' } };
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Items: [mockItem],
      });

      const products = await service.findAllProducts();
      expect(products).toHaveLength(1);
      expect(products[0]).toMatchObject({ id: 'prod-1', name: 'Product #1' });
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(ScanCommand),
      );
    });
  });

  describe('findOneProduct', () => {
    it('should return null if the item does not exist', async () => {
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Item: undefined,
      });

      const result = await service.findOneProduct('nonexistent');
      expect(result).toBeNull();
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(GetItemCommand),
      );
    });

    it('should return a product if the item exists', async () => {
      const mockItem = { id: { S: 'prod-1' }, name: { S: 'Product #1' } };
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Item: mockItem,
      });

      const result = await service.findOneProduct('prod-1');
      expect(result).toMatchObject({ id: 'prod-1', name: 'Product #1' });
    });
  });

  describe('updateProductStock', () => {
    it('should update the stock for each product and return the updated items', async () => {
      const updates: {
        id: string;
        stock_variation: number;
        variation: 'INCREMENT' | 'REDUCE';
      }[] = [
        { id: 'prod-1', stock_variation: 5, variation: 'INCREMENT' },
        { id: 'prod-2', stock_variation: 2, variation: 'REDUCE' },
      ];

      (dynamoDBClientMock.send as jest.Mock)
        .mockResolvedValueOnce({
          Attributes: marshall({ id: 'prod-1', stock_amount: 15 }),
        })
        .mockResolvedValueOnce({
          Attributes: marshall({ id: 'prod-2', stock_amount: 8 }),
        });

      const result = await service.updateProductStock(updates);
      expect(dynamoDBClientMock.send).toHaveBeenCalledTimes(2);
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(UpdateItemCommand),
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: 'prod-1', stock_amount: 15 });
      expect(result[1]).toMatchObject({ id: 'prod-2', stock_amount: 8 });
    });
  });
});
