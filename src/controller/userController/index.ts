import { Controller, Post, Body } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { loginDto, UserResponseDto } from '@/dto/userDto';
import { UseService } from '@/service/useService';

@Controller('user')
export class UserController {
  constructor(private readonly useService: UseService) {}

  @Post('login')
  async login(@Body() body: loginDto): Promise<UserResponseDto> {
    try {
      const res = await this.useService.login(body);
      return res;
    } catch (error) {
      console.error(error); // 使用 console.error 更合适
      throw new HttpException('登录失败', HttpStatus.UNAUTHORIZED);
    }
  }

  // @Post('register')
  // async register(@Body() body: any) {
  //   return await this.useService.register(body);
  // }
}
