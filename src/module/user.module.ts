import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/entity/userEntity';
import { UserController } from '@/controller/userController';
import { UseService } from '@/service/useService';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule],
  controllers: [UserController],
  providers: [UseService],
  exports: [UseService],
})
export class UserModule {}
