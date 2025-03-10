import { NestFactory } from '@nestjs/core';
// import { Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ResponseTransformerInterceptor } from '@/utils/response-transformer.interceptor';
// import { LoggingInterceptor } from '@/utils/log-config/logging.interceptor';
// import { JwtAuthGuard } from '@/utils/jwt.guard'; //JWT守卫
import { AppModule } from './module';

dotenv.config();
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    // 配置全局 JWT 守卫
    // const reflector = app.get(Reflector);
    // app.useGlobalGuards(new JwtAuthGuard(reflector));
    // 注册全局响应转换拦截器
    app.useGlobalInterceptors(new ResponseTransformerInterceptor());

    const config = new DocumentBuilder()
      .setTitle('API 文档')
      .setDescription('API 描述')
      .setVersion('1.0')
      .addTag('api')
      // 添加 JWT 认证配置
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    const prot = process.env.SERVICE_PORT ?? 3000;
    await app.listen(prot);
    console.log(`asp-xms-service服务启动成功:${prot ?? 3000}`);
  } catch (error) {
    console.log(`asp-xms-service服务启动失败:${error}`);
  }
}
void bootstrap();
