## Redis在Docker 安装使用

### 1. 拉取 Redis 镜像

```bash
docker pull redis
```

### 2. 运行 Redis 容器

```bash
docker run -d --name my-redis -p 6379:6379 redis
```

该命令会在后台启动一个名为 my-redis 的 Redis 容器，并将容器的 6379 端口映射到主机的 6379 端口。

### 3. 连接到 Redis 服务器

使用 redis-cli 连接到运行在 Docker 容器中的 Redis 服务器：

```bash
redis-cli -h 127.0.0.1 -p 6379
```

## 4. 设置 Redis 配置（可选）

如果你需要自定义 Redis 配置，可以创建一个 redis.conf 文件并将其挂载到容器中。例如：

创建 redis.conf 文件：

```bash
maxmemory 256mb
maxmemory-policy allkeys-lru
```

```bash
docker run -d --name my-redis -p 6379:6379 -v /path/to/redis.conf:/usr/local/etc/redis/redis.conf redis redis-server /usr/local/etc/redis/redis.conf
```

## 5. 设置 Redis 密码（可选）

```bash
docker run -d --name my-redis -p 6379:6379 -e REDIS_PASSWORD=your_password redis redis-server --requirepass "your_password"
```

然后，连接到 Redis 服务器时需要提供密码：

```bash
redis-cli -h 127.0.0.1 -p 6379 -a your_password

```

## 6. 查看 Redis 日志

```bash
docker logs my-redis
```

## 7. 停止和删除 Redis 容器

```bash
docker stop my-redis
docker rm my-redis
```
