import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
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

      const token = this.jwtService.sign(
        {
          id: user.id,
          username: user.username,
          timestamp: new Date().getTime(),
        },
        { expiresIn: '1h', secret: process.env.JWT_SECRET },
      );
      const redisKey = `user:${user.username}`;
      // 检查缓存是否存在
      const cacheExists = await RedisCache.exists(redisKey);

      if (!cacheExists) {
        // 如果缓存不存在，设置缓存
        const redisSet = await RedisCache.set(redisKey, token, 60 * 60);
        const getRedis = await RedisCache.get(redisKey);
        if (!redisSet) {
          throw new BadRequestException('设置 Redis 缓存失败');
        }
        return {
          username: user.username,
          token: JSON.stringify(getRedis),
        };
      } else {
        // 如果缓存存在，更新缓存的过期时间
        const redisExpire = await RedisCache.expire(redisKey, 60 * 60);
        if (!redisExpire) {
          new BadRequestException('更新 Redis 缓存过期时间失败');
        }
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

    const hashedPassword: string = registerDto.password;

    try {
      const newUser = this.userRepository.create({
        username: registerDto.username,
        password: hashedPassword,
        mobile_number: registerDto.mobile_number,
        email: registerDto.email,
        createdAt: new Date(),
      });
      const savedUser = await this.userRepository.save(newUser);
      if (!savedUser) {
        new BadRequestException('用户创建失败');
      }

      return {
        username: savedUser.username,
      };
    } catch (error) {
      throw new BadRequestException(`用户创建失败: ${(error as Error).message || '未知错误'}`);
    }
  }
}
