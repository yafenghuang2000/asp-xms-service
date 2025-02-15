import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@/utils/log-config/logging.interceptor';
import { JwtGlobalModule } from '@/utils/module-config/jwt.global.module';
import { TypeOrmConfigModule } from '@/utils/module-config/typeorm-config.module';
import { GlobalEntitiesModule } from '@/utils/module-config/global-entities.module';
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
