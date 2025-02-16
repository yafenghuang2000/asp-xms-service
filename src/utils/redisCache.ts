import Redis from 'ioredis';

class RedisCache {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('connect', () => {
      const host = this.client.options.host;
      const port = this.client.options.port;
      console.log(`Redis 连接成功:${host}:${port}`);
    });

    this.client.on('error', (err) => {
      const host = this.client.options.host;
      const port = this.client.options.port;
      console.log(`Redis 连接失败:${host}:${port}`, err);
    });
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await this.client.set(key, JSON.stringify(value), 'EX', ttl);
      } else {
        await this.client.set(key, JSON.stringify(value));
      }
      return true; // 返回 true 表示缓存成功
    } catch (error) {
      console.error('Failed to set value in Redis:', error);
      return false; // 返回 false 表示缓存失败
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      console.error('Failed to get value from Redis:', error);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await this.client.del(key);
      return true; // 返回 true 表示删除成功
    } catch (error) {
      console.error('Failed to delete value from Redis:', error);
      return false; // 返回 false 表示删除失败
    }
  }

  async clear(): Promise<boolean> {
    try {
      await this.client.flushall();
      return true; // 返回 true 表示清除成功
    } catch (error) {
      console.error('Failed to clear Redis:', error);
      return false; // 返回 false 表示清除失败
    }
  }
}

export default new RedisCache();
