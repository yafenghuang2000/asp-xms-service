// jwt.strategy.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * JWT策略类，用于验证JWT的有效性
 * 使用PassportStrategy装饰器标记JwtStrategy类，使其成为一个Passport策略
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // 构造函数，用于初始化JwtStrategy实例
  constructor() {
    // 调用父类PassportStrategy的构造函数，传入配置对象
    super({
      // 指定从请求头中提取JWT的方式，这里使用的是从Authorization头中以Bearer Token的形式提取
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 设置是否忽略JWT的过期时间，这里设置为false，即不忽略过期时间
      ignoreExpiration: false,
      // 设置用于验证JWT的密钥，这里使用的是'your-secret-key'
      secretOrKey: 'your-secret-key', // 建议使用环境变量存储密钥
    });
  }

  // validate方法用于验证JWT的有效性，并返回验证后的payload
  validate(payload: unknown) {
    return payload;
  }
}

/**
 * JWT守卫类，用于保护需要认证的路由
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  // 构造函数，注入JwtService和Reflector服务
  constructor(
    private jwtService: JwtService, // JwtService用于处理JWT相关的操作
    private reflector: Reflector, // Reflector用于反射操作，这里未使用
  ) {}

  // 实现CanActivate接口的canActivate方法，用于判断请求是否可以通过守卫
  canActivate(context: ExecutionContext): boolean {
    // 从上下文中获取HTTP请求对象
    const request: Request = context.switchToHttp().getRequest();
    try {
      // 从请求头中提取JWT令牌
      const token = this.extractTokenFromHeader(request);
      // 如果令牌不存在，返回false，表示请求未通过守卫
      if (!token) return false;
      // 验证JWT令牌，获取令牌的负载信息
      // 将负载信息存储在请求对象中，以便后续中间件或路由处理器使用
      request['user'] = this.jwtService.verify(token);
      // 返回true，表示请求通过守卫
      return true;
    } catch (err) {
      // 捕获并打印错误信息
      console.log('Can not activate jwt guard', err);
      // 返回false，表示请求未通过守卫
      return false;
    }
  }

  // 从请求头中提取JWT令牌的私有方法
  private extractTokenFromHeader(request: Request): string | undefined {
    // 获取Authorization请求头
    const authorizationHeader = request.get('Authorization');
    // 如果Authorization头不是字符串类型，返回undefined
    if (typeof authorizationHeader !== 'string') return undefined;
    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer') return undefined;
    return token;
  }
}
