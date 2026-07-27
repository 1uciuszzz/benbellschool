# Benbellschool

## Inicio

1. Instalar dependencias

```bash
npm i
pnpm i
```

2. Modificar variables de entorno

`docker-compose.yaml`:

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  restart: always
  environment:
    # Por favor modifique las siguientes variables
    DATABASE_URL: postgresql://postgres:postgres@db:23301/postgres?schema=public
    JWT_SECRET: 78b37db2f09767c7ad3eb47c903739359c69aa57080c2710db92fcb1809f8cd4
    JWT_ACCESS_TOKEN_TTL: 86400
  ports:
    - "23302:3000"
  depends_on:
    - db
```

3. Construir imagen

```bash
docker compose build
```

4. Desplegar

```bash
docker compose up -d
```
