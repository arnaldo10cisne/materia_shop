import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/models';

@Injectable()
export class UsersService {
  findAllUsers() {
    return [];
  }

  findOneUser(id: UserModel['id']) {
    return { id };
  }
}
