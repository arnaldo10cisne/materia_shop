import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from 'src/models';

@Controller('users') // myapp.api/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /users or /users?role=value
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id') // GET /users/:id
  findOneUser(@Param('id') id: UserModel['id']) {
    return this.usersService.findOneUser(id);
  }
}
