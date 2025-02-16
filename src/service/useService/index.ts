import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import RedisCache from '@/utils/redisCache';
import { LoginResponseDto, LoginDto, RegisterDto, RegisterResponseDto } from '@/dto/userDto';
import { UserEntity } from '@/entity/userEntity/user.entity';

@Injectable()
export class UseService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  login = async (loginDto: LoginDto): Promise<LoginResponseDto> => {
    try {
      const user = await this.userRepository.findOne({
        where: { username: loginDto.username },
      });

      if (!user) {
        throw new BadRequestException('用户不存在');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('密码错误');
      }

      const token = this.jwtService.sign(
        {
          id: user.id,
          username: user.username,
          timestamp: new Date().getTime(),
        },
        { expiresIn: '1h', secret: process.env.JWT_SECRET },
      );

      const redis = await RedisCache.set(`user:${user.username}`, token, 60 * 60); //redis缓存token

      if (!redis) {
        throw new BadRequestException('redis缓存失败');
      }

      return {
        username: user.username,
        token: token,
      };
    } catch (error) {
      throw new BadRequestException(`用户创建失败: ${(error as Error).message || '未知错误'}`);
    }
  };

  // 注册用户
  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    // 检查用户是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });

    if (existingUser) {
      throw new BadRequestException('用户已存在');
    }

    // 检查密码是否符合要求
    if (registerDto.password.length < 6) {
      throw new BadRequestException('密码长度必须大于6位');
    }

    // 检查邮箱是否符合要求
    if (!registerDto.email.includes('@')) {
      throw new BadRequestException('邮箱格式不正确');
    }

    // 检查手机号码是否符合要求
    const mobileRegex = /^1[3-9]\d{9}$/;
    if (registerDto.mobile_number && !mobileRegex.test(registerDto.mobile_number)) {
      throw new BadRequestException('手机号码格式不正确');
    }

    // 密码使用bcrypt加密
    const saltOrRounds = 10;
    const hashedPassword: string = await bcrypt.hash(registerDto.password, saltOrRounds);

    try {
      const newUser = this.userRepository.create({
        username: registerDto.username,
        password: hashedPassword,
        mobile_number: registerDto.mobile_number,
        email: registerDto.email,
        createdAt: new Date(),
      });
      const savedUser = await this.userRepository.save(newUser);
      console.log(savedUser, 'savedUser');

      if (savedUser && savedUser.id) {
        return {
          username: savedUser.username,
        };
      }
      throw new BadRequestException('用户创建失败');
    } catch (error) {
      throw new BadRequestException(`用户创建失败: ${(error as Error).message || '未知错误'}`);
    }
  }
}
