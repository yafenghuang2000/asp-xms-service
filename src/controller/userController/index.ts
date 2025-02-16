import { Body, Controller, Post, InternalServerErrorException } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { BaseTransformResponse } from '@/utils/response-transformer.interceptor';
import { Public } from '@/utils/jwt-config/public.decorator';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from '@/dto/userDto';
import { UseService } from '@/service/useService';

@Controller('user')
export class UserController {
  constructor(private readonly useService: UseService) {}

  @Post('login')
  // @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({
    description: '登录请求体',
    type: LoginDto,
  })
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    try {
      const result = await this.useService.login(body);
      return BaseTransformResponse(LoginResponseDto, result);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: '注册用户' })
  @ApiBody({
    description: '注册用户请求体',
    type: RegisterDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      const savedUser = await this.useService.register(registerDto);
      return BaseTransformResponse(RegisterResponseDto, savedUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
