import { Module } from '@nestjs/common';
import { UserController } from '@/controller/userController';
import { UseService } from '@/service/useService';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UseService],
  exports: [UseService],
})
export class UserModule {}
