import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';

/**
 * 登录请求体
 */
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '用户名',
    required: true,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '密码',
    required: true,
  })
  password: string;
}

/**
 * 登录响应体
 */
export class LoginResponseDto {
  @ApiProperty({ description: '用户名' })
  @Expose()
  username: string;

  @ApiProperty({ description: 'token' })
  @Expose()
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
    required: true, //必传字段
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '密码',
    required: true, //必传字段
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '手机号码',
    required: true, //必传字段
  })
  mobile_number?: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: '邮箱',
    required: true, //必传字段
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '用户ID',
    required: false,
  })
  user_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '用户类型',
    required: false,
  })
  user_type?: string;

  @IsOptional()
  @ApiProperty({
    type: Number,
    description: '状态',
    required: false,
  })
  status?: number;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: '角色',
    required: false,
  })
  role?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => String)
  @ApiProperty({
    type: [String],
    description: '权限',
    required: false,
  })
  permission?: string[];
}

/**
 * 注册响应体
 */
export class RegisterResponseDto {
  @ApiProperty({ description: '用户名' })
  @Expose()
  username: string;
}
