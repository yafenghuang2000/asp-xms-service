import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { BusinessException, BaseTransformResponse } from '@/utils/response-transformer.interceptor';
import { Public } from '@/utils/jwt-config/public.decorator';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from '@/dto/userDto';
import { UseService } from '@/service/useService';
// import { plainToClass } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private readonly useService: UseService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({
    description: '登录请求体',
    type: LoginDto,
  })
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    try {
      const result = await this.useService.login(body);
      return result ?? null;
    } catch (error) {
      if (error instanceof Error) {
        throw new BusinessException(error.message);
      } else {
        throw new BusinessException(String(error));
      }
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
      if (error instanceof Error) {
        throw new BusinessException(String(error.message));
      } else {
        throw new BusinessException(String(error));
      }
    }
  }
}
