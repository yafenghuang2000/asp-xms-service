import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createWinstonLogger, CustomLogger } from './winston.config';
import { Request } from 'express';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: CustomLogger;

  constructor() {
    this.logger = createWinstonLogger();
  }

  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<T> {
    const request: Request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body as Record<string, unknown>;
    const headers = request.headers as Record<string, string>;
    const requestTime = new Date().toISOString();
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (responseBody: T) => {
          const logData = {
            requestInfo: {
              timestamp: requestTime,
              method,
              url,
              headers: headers,
              body: body || {},
            },
            responseInfo: {
              timestamp: new Date().toISOString(),
              duration: `${Date.now() - now}ms`,
              body: responseBody as Record<string, unknown>,
              status: 'success',
            },
          };
          this.logger.success(logData);
        },
        error: (error: Error) => {
          const logData = {
            requestInfo: {
              timestamp: requestTime,
              method,
              url,
              headers: headers,
              body: body || {},
            },
            responseInfo: {
              timestamp: new Date().toISOString(),
              duration: `${Date.now() - now}ms`,
              status: 'error',
              body: {
                ...error,
              },
            },
          };
          this.logger.failure(logData);
        },
      }),
    );
  }
}
