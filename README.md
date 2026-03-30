# hlpf-env-setup

## Student

- Kononenko D.A;

- Group: 232/1;

## Практичне заняття №2 — NestJS + PostgreSQL + Redis

## Структура репозиторію

```
.
├── src/               # NestJS source code
├── Dockerfile
├── docker-compose.yml
├── .env.example       # шаблон змінних оточення
└── README.md
```

## Запуск проекту

```bash
cp .env.example .env   # налаштувати значення
docker compose up --build
```

## Перевірка сервісів

```text
NAME                        IMAGE                COMMAND                  SERVICE    CREATED        STATUS                    PORTS
hlpf-env-setup-postgres-1   postgres:16-alpine   "docker-entrypoint.s…"   postgres   22 hours ago   Up 11 minutes (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
hlpf-env-setup-redis-1      redis:7-alpine       "docker-entrypoint.s…"   redis      22 hours ago   Up 11 minutes (healthy)   0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp
```

## Перевірка PostgreSQL

```text
❯ docker compose exec postgres psql -U nestuser -d nestdb -c '\l'
                                                      List of databases
   Name    |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+------------+------------+------------+-----------+-----------------------
 nestdb    | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
 postgres  | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
 template0 | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/nestuser          +
           |          |          |                 |            |            |            |           | nestuser=CTc/nestuser
 template1 | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/nestuser          +
           |          |          |                 |            |            |            |           | nestuser=CTc/nestuser
```

## Перевірка Redis

```text
PONG
```

## Перевірка застосунку

```text
Hello World!
```

## Логи NestJS (фрагмент)

```text
[8:03:53 PM] Starting compilation in watch mode...
app-1  |
app-1  | [8:03:57 PM] Found 0 errors. Watching for file changes.
app-1  |
app-1  | [Nest] 29  - 03/30/2026, 8:03:58 PM     LOG [NestFactory] Starting Nest application...
app-1  | [Nest] 29  - 03/30/2026, 8:03:58 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +84ms
app-1  | [Nest] 29  - 03/30/2026, 8:03:58 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
app-1  | [Nest] 29  - 03/30/2026, 8:03:58 PM     LOG [InstanceLoader] AppModule dependencies initialized +0ms
app-1  | [Nest] 29  - 03/30/2026, 8:03:58 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
app-1  | [Nest] 29  - 03/30/2026, 8:03:58 PM     LOG [InstanceLoader] CacheModule dependencies initialized +13ms
app-1  | [Nest] 29  - 03/30/2026, 8:03:58 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +50ms
app-1  | [Nest] 29  - 03/30/2026, 8:03:58 PM     LOG [RoutesResolver] AppController {/}: +7ms
app-1  | [Nest] 29  - 03/30/2026, 8:03:58 PM     LOG [RouterExplorer] Mapped {/, GET} route +4ms
app-1  | [Nest] 29  - 03/30/2026, 8:03:58 PM     LOG [NestApplication] Nest application successfully started +3ms
```
