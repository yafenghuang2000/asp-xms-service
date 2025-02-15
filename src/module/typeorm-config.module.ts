// typeorm-config.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'my-test',
      entities: [path.join(__dirname, '../entity/**/*.entity{.ts,.js}')], // 使用相对路径并支持子目录
      synchronize: true, // 开发环境下可以设为true，生产环境下建议设为false(自动同步数据库结构)
      logging: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
