import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserModel } from '../models';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    // Create a mock service
    const mockUsersService = {
      findAllUsers: jest.fn(),
      findOneUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should call UsersService.findAllUsers and return its result', async () => {
      const mockUsers: UserModel[] = [
        { id: 'user-1', name: 'User One' },
        { id: 'user-2', name: 'User Two' },
      ];

      jest.spyOn(service, 'findAllUsers').mockResolvedValueOnce(mockUsers);

      const result = await controller.findAllUsers();
      expect(service.findAllUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOneUser', () => {
    it('should call UsersService.findOneUser with the correct id and return the user', async () => {
      const mockUser: UserModel = { id: 'user-123', name: 'John Doe' };
      jest.spyOn(service, 'findOneUser').mockResolvedValueOnce(mockUser);

      const result = await controller.findOneUser('user-123');
      expect(service.findOneUser).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockUser);
    });
  });
});
