import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

// 从环境变量获取 Redis 配置，若未设置则使用默认值
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
});

// 使用 Global 装饰器将该模块标记为全局模块
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: redisClient,
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
