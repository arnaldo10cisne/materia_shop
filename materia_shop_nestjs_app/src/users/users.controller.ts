import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from 'src/models';

@Controller('users') // myapp.api/users
export class UsersController {
  /*
    GET /users
    GET /users/:id
    POST /users
    PATCH /users/:id
    DELETE /users/:id
  */

  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /users or /users?role=value
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id') // GET /users/:id
  findOneUser(@Param('id') id: UserModel['id']) {
    return this.usersService.findOneUser(id);
  }

  // @Patch(':id') // PATCH /users/:id
  // updateUser(@Param('id') id: string, @Body() userUpdated: {}) {
  //   return {
  //     id,
  //     ...userUpdated,
  //   };
  // }

  // @Delete(':id') // DELETE /users/:id
  // deleteUser(@Param('id') id: string) {
  //   return ['user deleted', { id }];
  // }
}
