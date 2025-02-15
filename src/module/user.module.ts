import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserEntity } from '@/entity/userEntity/user.entity';
import { UserController } from '@/controller/userController';
import { UseService } from '@/service/useService';

// 使用@Module装饰器定义一个模块，模块是NestJS中的基本构建块
@Module({
  // imports数组用于导入其他模块，这里导入TypeOrmModule并指定UserEntity作为特征
  // TypeOrmModule.forFeature用于定义模块中需要使用的实体
  // imports: [TypeOrmModule.forFeature([UserEntity])],
  // controllers数组用于定义该模块中包含的控制器
  // UserController是处理用户相关请求的控制器
  controllers: [UserController],
  // providers数组用于定义该模块中包含的服务
  // UseService是用户相关的服务，提供业务逻辑处理
  providers: [UseService],
  // exports数组用于定义该模块中需要导出的服务
  // 这样其他模块可以通过导入UserModule来使用UseService
  exports: [UseService],
})
// 使用export关键字导出UserModule类，使其可以被其他模块导入和使用
export class UserModule {}
