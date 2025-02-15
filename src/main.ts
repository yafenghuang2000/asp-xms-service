import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
      .setTitle('API 文档')
      .setDescription('API 描述')
      .setVersion('1.0')
      .addTag('api')
      // 添加 JWT 认证配置
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: '输入 JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000);
    console.log(`asp-xms-service服务启动成功:${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.log(`asp-xms-service服务启动失败:${error}`);
  }
}
void bootstrap();
