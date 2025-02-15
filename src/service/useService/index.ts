import { Injectable } from '@nestjs/common';
import { UserResponseDto, loginDto } from '@/dto/userDto';

@Injectable()
export class UseService {
  async login(body: loginDto): Promise<UserResponseDto> {
    console.log(body, 'body');
    return new Promise((resolve) => {
      resolve({
        username: 'string',
        age: 11,
        gender: 'string',
        address: 'string',
        phone: 'string',
      });
    });
  }

  register = (): Promise<UserResponseDto> => {
    return new Promise((resolve) => {
      resolve({
        username: '李四',
        age: 20,
        gender: '女',
        address: '上海市',
        phone: '13999999999',
      });
    });
  };
}
