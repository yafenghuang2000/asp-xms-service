import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file'; // 确保引入此模块
import * as path from 'path';

export interface CustomLogger extends Logger {
  success: (message: string | Record<string, unknown>) => void;
  failure: (message: string | Record<string, unknown>) => void;
}

const logDir = 'logs'; // 日志根目录

// 成功请求日志传输配置
const successTransport = new transports.DailyRotateFile({
  dirname: path.join(logDir, 'success'), // logs/success 目录
  filename: '%DATE%-success.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: format.combine(
    format.timestamp(),
    format.json(),
    format((info) => {
      if (info.type === 'success') return info;
      return false;
    })(),
  ),
  level: 'info', // 只记录 info 级别的日志
});

// 失败请求日志传输配置
const failureTransport = new transports.DailyRotateFile({
  dirname: path.join(logDir, 'error'), // logs/error 目录
  filename: '%DATE%-error.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: format.combine(
    format.timestamp(),
    format.json(),
    format((info) => {
      if (info.type === 'error') return info;
      return false;
    })(),
  ),
  level: 'error', // 只记录 error 级别的日志
});

export const createWinstonLogger = (): CustomLogger => {
  const logger = createLogger({
    level: 'info', // 日志级别
    format: format.combine(
      format.timestamp(), // 添加时间戳
      format.json(), // 日志格式为 JSON
    ),
    transports: [
      successTransport,
      failureTransport,
      new transports.Console(), // 控制台输出
    ],
  }) as CustomLogger;

  logger.success = (message: string | Record<string, unknown>) => {
    logger.info({ type: 'success', message }); // 添加类型标记
  };

  logger.failure = (message: string | Record<string, unknown>) => {
    logger.error({ type: 'error', message }); // 添加类型标记
  };
  return logger;
};
