import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@/utils/log-config/logging.interceptor';
import { JwtGlobalModule } from './module-config/jwt.global.module';
import { TypeOrmConfigModule } from './module-config/typeorm-config.module';
import { GlobalEntitiesModule } from './module-config/global-entities.module';
import { RedisModule } from './module-config/redis.module';
import { UserModule } from './user.module';

@Module({
  imports: [JwtGlobalModule, TypeOrmConfigModule, GlobalEntitiesModule, RedisModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
