import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { Response } from 'express';

interface ResponseTransformer<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
// 实现NestInterceptor接口的intercept方法，用于拦截请求和响应
export class ResponseTransformerInterceptor implements NestInterceptor {
  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();
    response.status(HttpStatus.OK); // 设置 HTTP 状态码为 200
    // 调用next.handle()获取处理后的响应流
    return next.handle().pipe(
      map((data: T) => {
        // 处理成功响应
        return {
          code: 0, // 成功状态码统一为 0
          message: 'success', // 默认成功信息
          data: data ?? null, // 明确指定 data 的类型为 T 或 null
        } as ResponseTransformer<T>;
      }),
      catchError((error: unknown) => {
        // 处理异常响应
        let message: string;
        let code: number;

        if (error instanceof HttpException) {
          const response = error.getResponse() as { code?: number; message?: string };
          message = error.message || '服务错误';
          code = response.code ?? 9000;
        } else {
          message = '服务错误';
          code = 9000;
        }

        return throwError(
          () =>
            new HttpException(
              {
                code,
                message,
                data: null,
              },
              HttpStatus.OK,
            ),
        ); // 确保状态码为 200
      }),
    );
  }
}

export function BaseTransformResponse<T, V>(cls: ClassConstructor<T>, data: V): T {
  return plainToClass(cls, data, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  });
}
