import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@/utils/logging.interceptor';
import { JwtGlobalModule } from './jwt.global.module';
import { TypeOrmConfigModule } from './typeorm-config.module';
import { GlobalEntitiesModule } from './global-entities.module';
import { UserModule } from './user.module';

@Module({
  imports: [JwtGlobalModule, TypeOrmConfigModule, GlobalEntitiesModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
