import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { LoggingInterceptor } from '@/utils/logging.interceptor';
import { JwtStrategy } from '@/utils/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user.module';
import { UserEntity } from '@/entity/userEntity';

@Module({
  imports: [
    PassportModule,
    JwtModule,
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
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AppModule {}
