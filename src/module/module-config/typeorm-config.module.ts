// typeorm-config.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
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
      entities: [path.join(__dirname, '../../entity/**/*.entity{.ts,.js}')], // 使用相对路径并支持子目录
      synchronize: true, // 开发环境下可以设为true，生产环境下建议设为false(自动同步数据库结构)
      poolSize: 300, // 配置连接池大小
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule implements OnModuleInit {
  constructor(private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      if (this.connection && !this.connection.isConnected) {
        await this.connection.connect();
        console.log('MySQL数据库连接成功:localhost:3306');
      } else {
        console.log('MySQL数据库已连接:localhost:3306');
      }
    } catch (error) {
      console.error('MySQL数据库连接失败:localhost:3306', error);
    }
  }
}
