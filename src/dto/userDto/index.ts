import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * 登录请求体
 */
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '用户名',
    example: 'john_doe',
    required: true,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '密码',
    example: 'password123',
    required: true,
  })
  password: string;
}

/**
 * 登录响应体
 */
export class LoginResponseDto {
  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: 'token' })
  token: string;
}

/**
 * 注册请求体
 */
export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '用户名',
    example: 'john_doe',
    required: true,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '密码',
    example: 'password123',
    required: true,
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '手机号码',
    example: '12345678901',
    required: false,
  })
  mobile_number?: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: '邮箱',
    example: 'john@example.com',
    required: true,
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '用户ID',
    example: 'user123',
    required: false,
  })
  user_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '用户类型',
    example: 'admin',
    required: false,
  })
  user_type?: string;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: '状态',
    example: 1,
    required: false,
  })
  status?: number;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: '角色',
    example: 'admin',
    required: false,
  })
  role?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: '权限',
    example: 'read,write',
    required: false,
  })
  permission?: string;
}

/**
 * 注册响应体
 */
export class RegisterResponseDto {
  @ApiProperty({ description: '用户名' })
  @Expose()
  username: string;
}
