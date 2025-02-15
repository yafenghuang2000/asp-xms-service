import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { loginDto, UserResponseDto } from '@/dto/userDto';
import { UseService } from '@/service/useService';

@Controller('user')
export class UserController {
  constructor(private readonly useService: UseService) {}

  @Post('login')
  async login(@Body() body: loginDto): Promise<UserResponseDto> {
    try {
      return await this.useService.login(body);
    } catch (error) {
      console.error(error); // 使用 console.error 更合适
      throw new HttpException('登录失败', HttpStatus.UNAUTHORIZED);
    }
  }
}
