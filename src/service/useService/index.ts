import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginResponseDto, LoginDto } from '@/dto/userDto';
import { UserEntity } from '@/entity/userEntity';

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
        throw new UnauthorizedException('用户不存在');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('密码错误');
      }

      const token = this.jwtService.sign(
        {
          id: user.id,
          username: user.username,
          timestamp: new Date().getTime(),
        },
        { expiresIn: '1h' },
      );

      return {
        username: user.username,
        token: token,
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException(e);
    }
  };
}
