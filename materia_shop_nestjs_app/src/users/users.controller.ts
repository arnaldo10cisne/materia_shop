import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from 'src/models';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  findOneUser(@Param('id') id: UserModel['id']) {
    return this.usersService.findOneUser(id);
  }
}
