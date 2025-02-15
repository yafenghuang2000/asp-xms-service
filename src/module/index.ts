import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { LoggingInterceptor } from '@/utils/logging.interceptor';
import { JwtStrategy } from '@/utils/jwt.strategy';
import { JwtAuthGuard } from '@/utils/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '@/utils/public.decorator';
import { UserModule } from './user.module';
import { UserEntity } from '@/entity/userEntity';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, //请使用一个安全的密钥
      signOptions: { expiresIn: '1h' }, //设置默认的过期时间为1小时
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'my-test',
      entities: [UserEntity],
      synchronize: true, // 开发环境下可以设为true，生产环境下建议设为false
    }),
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AppModule {}
