import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@/utils/logging.interceptor';
// import { ErrorHandlerService } from '@/utils/response-transformer.interceptor';
import { JwtGlobalModule } from '@/utils/jwt.global.module';
import { TypeOrmConfigModule } from '@/utils/typeorm-config.module';
import { GlobalEntitiesModule } from '@/utils/global-entities.module';
import { UserModule } from './user.module';

@Module({
  imports: [JwtGlobalModule, TypeOrmConfigModule, GlobalEntitiesModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ErrorHandlerService,
    // },
  ],
})
export class AppModule {}
