# Full-stack template

## 准备工作

1. 安装依赖

```bash
npm i
yarn i
pnpm i
```

2. 准备环境变量

创建`.env`文件，填写下列变量值

```conf
DATABASE_URL=
JWT_SECRET=
JWT_TOKEN_AUDIENCE=
JWT_TOKEN_ISSUER=
JWT_ACCESS_TOKEN_TTL=
MINIO_ENDPOINT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=
```

3. 其他信息

`src/main.ts`，修改端口

```ts
// 请修改8080为需要的端口号
await app.listen(3000);
```

`dockerfile`，修改暴露端口

```dockerfile
# 请修改8080为需要的端口号
EXPOSE 8080
```

4. 启动项目

项目依赖`postgresql`、`minio`和`redis`，启动项目前在docker中准备这些环境

在顶层目录下，运行：

```bash
docker compose build
docker compose up -d
```

然后停止其中的前端和后端服务，至此，开发环境准备完成

生成prisma客户端：

```bash
npx prisma generate
pnpm dlx prisma generate
```

或

```bash
npm run db:gen
pnpm db:gen
```

同步数据库表

```bash
npx prisma db push
pnpm dlx prisma db push
```

或

```bash
npm run db:push
pnpm db:push
```

启动服务：

```bash
npm run start:dev
pnpm start:dev
```
