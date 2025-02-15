import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass, ClassConstructor } from 'class-transformer';

@Injectable()
// 实现NestInterceptor接口的intercept方法，用于拦截请求和响应
export class ResponseTransformerInterceptor implements NestInterceptor {
  intercept<T>(_context: ExecutionContext, next: CallHandler): Observable<T> {
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

export class BaseController {
  protected transformResponse<T, V>(cls: ClassConstructor<T>, data: V): T {
    return plainToClass(cls, data, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
  }

  protected BusinessExceptionResponse(
    message: string | { code: number; message: string },
    code: number = 9000,
  ) {
    throw new BusinessException(message, code);
  }
}
