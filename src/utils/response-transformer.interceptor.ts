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

@Injectable()
// 实现NestInterceptor接口的intercept方法，用于拦截请求和响应
export class ResponseTransformerInterceptor implements NestInterceptor {
  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<T> {
    // console.log(_context, '======_context');
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();
    response.status(HttpStatus.OK); // 设置 HTTP 状态码为 200

    // 调用next.handle()获取处理后的响应流
    return next.handle().pipe(
      // 使用map操作符对响应数据进行转换

      map((data: T) => {
        // 处理成功响应
        return {
          code: 0, // 成功状态码统一为 0
          message: 'success', // 默认成功信息
          data: data ?? null, // 明确指定 data 的类型为 T 或 null
        } as T;
      }),
      catchError((error: unknown) => {
        // 处理异常响应
        let message: string;
        let code: number;

        if (error instanceof HttpException) {
          const response = error.getResponse() as { code?: number; message?: string };
          message = error.message || 'Internal server error';
          code = response.code ?? 9000;
        } else {
          message = 'Internal server error';
          code = 9000;
        }
        console.log(error, ';111111');

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

//指定异常类
export class BusinessException extends HttpException {
  constructor(message: string | { code: number; message: string }, code: number = 9000) {
    if (typeof message === 'string') {
      super({ code: 9000, data: null, message }, 200);
    } else {
      super(
        {
          code: message.code ?? code,
          message: message.message,
          data: null,
        },
        200,
      );
    }
  }
}

export function ErrorHandlerService(error: unknown): never {
  if (error instanceof Error) {
    throw new BusinessException(error.message);
  } else {
    throw new BusinessException(String(error));
  }
}

export function BaseTransformResponse<T, V>(cls: ClassConstructor<T>, data: V): T {
  return plainToClass(cls, data, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  });
}
