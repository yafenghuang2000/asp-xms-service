import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
    console.log(`asp-xms-service服务启动成功:${process.env.PORT ?? 3000}`);
  } catch (error) {
    console.log(`asp-xms-service服务启动失败:${error}`);
  }
}
void bootstrap();
