import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';

// 1) Mock DynamoDB so no real AWS calls occur
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

describe('UsersService', () => {
  let service: UsersService;
  let dynamoDBClientMock: jest.Mocked<DynamoDBClient>;

  beforeEach(async () => {
    // Provide an environment variable if needed
    process.env.USERS_TABLE_NAME = 'MockUsersTable';

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Extract the mocked DynamoDBClient from the service
    dynamoDBClientMock = (service as any).dynamoDBClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const mockItem = { id: { S: 'user-1' }, name: { S: 'User One' } };
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Items: [mockItem],
      });

      const result = await service.findAllUsers();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ id: 'user-1', name: 'User One' });
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(ScanCommand),
      );
    });
  });

  describe('findOneUser', () => {
    it('should return null if no item is found', async () => {
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Item: undefined,
      });

      const user = await service.findOneUser('non-existent');
      expect(user).toBeNull();
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(GetItemCommand),
      );
    });

    it('should return a UserModel if item is found', async () => {
      const mockItem = { id: { S: 'user-123' }, name: { S: 'Alice' } };
      (dynamoDBClientMock.send as jest.Mock).mockResolvedValueOnce({
        Item: mockItem,
      });

      const user = await service.findOneUser('user-123');
      expect(user).toMatchObject({ id: 'user-123', name: 'Alice' });
      expect(dynamoDBClientMock.send).toHaveBeenCalledWith(
        expect.any(GetItemCommand),
      );
    });
  });
});
