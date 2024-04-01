# Full-stack template

## 启动

1. 安装依赖项

```bash
npm i
pnpm i
```

2. 修改环境变量

`docker-compose.yaml`：

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  restart: always
  environment:
    # 请修改下列变量
    DATABASE_URL: postgresql://postgres:postgres@db:5432/postgres?schema=public
    JWT_SECRET: 78b37db2f09767c7ad3eb47c903739359c69aa57080c2710db92fcb1809f8cd4
    JWT_TOKEN_AUDIENCE: "192.168.100.27:22815"
    JWT_TOKEN_ISSUER: "192.168.100.27:22815"
    JWT_ACCESS_TOKEN_TTL: 86400
    MINIO_ENDPOINT: http://minio:9000
    MINIO_BUCKET: threed-control-system
    MINIO_ACCESS_KEY: minioadmin
    MINIO_SECRET_KEY: minioadmin
  ports:
    - "22815:3000"
  depends_on:
    - db
    - redis
    - minio
```

3. 构建映像

```bash
docker compose build
```

4. 部署

```bash
docker compose up -d
```
