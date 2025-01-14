import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/models';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class UsersService {
  private readonly dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
  private readonly table_name = 'MateriaShop__users-table';

  async findAllUsers() {
    const command = new ScanCommand({ TableName: this.table_name });
    const response = await this.dynamoDBClient.send(command);
    return response.Items.map((item) => unmarshall(item));
  }

  async findOneUser(id: UserModel['id']) {
    const command = new GetItemCommand({
      TableName: this.table_name,
      Key: marshall({ id }),
    });
    const response = await this.dynamoDBClient.send(command);
    return response.Item ? unmarshall(response.Item) : null;
  }
}
