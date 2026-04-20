# hlpf-env-setup

## Student

- Kononenko D.A.
- Group: 232/1 online

## Практичне заняття №3 — CRUD REST API для MiniShop

### Структура репозиторію

```
.
├── src/
│   ├── categories/
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── migrations/
│   │   ├── 1700000001-CreateTables.ts
│   │   └── <timestamp>-AddIsActiveToProducts.ts
│   ├── data-source.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Запуск проекту

```bash
cp .env.example .env
docker compose up --build
```

### API Endpoints

| Method | URL                 | Опис               |
| ------ | ------------------- | ------------------ |
| GET    | /api/categories     | Список категорій   |
| GET    | /api/categories/:id | Одна категорія     |
| POST   | /api/categories     | Створити категорію |
| PATCH  | /api/categories/:id | Оновити категорію  |
| DELETE | /api/categories/:id | Видалити категорію |
| GET    | /api/products       | Список продуктів   |
| GET    | /api/products/:id   | Один продукт       |
| POST   | /api/products       | Створити продукт   |
| PATCH  | /api/products/:id   | Оновити продукт    |
| DELETE | /api/products/:id   | Видалити продукт   |

### Перевірка міграцій

```text
           List of relations
 Schema |    Name    | Type  |  Owner
--------+------------+-------+----------
 public | categories | table | nestuser
 public | migrations | table | nestuser
 public | products   | table | nestuser
(3 rows)
```

### Тест створення категорії

```text
{"id":5,"name":"PC","description":null,"createdAt":"2026-03-31T10:05:10.052Z"}%
```

### Тест створення продукту

```text
{"id":3,"name":"Laptop Lenovo","description":null,"price":9.99,"stock":200,"isActive":true,"category":null,"createdAt":"2026-03-31T10:06:08.471Z","updatedAt":"2026-03-31T10:06:08.471Z"}%
```

### Тест отримання продуктів

```text
{"id":3,"name":"Laptop Lenovo","description":null,"price":"9.99","stock":200,"isActive":true,"category":null,"createdAt":"2026-03-31T10:06:08.471Z","updatedAt":"2026-03-31T10:06:08.471Z"}%
```

### Тест 404

```text
{"message":"Product #999 not found","error":"Not Found","statusCode":404}%
```

---

## Практичне заняття №4 — DTO + class-validator + Pipes

### Exercise 1 — Install validation packages

Packages added to `package.json` and installed via `docker compose exec app npm install`:

```bash
docker compose exec app npm install
# added 8 packages, changed 1 package, and audited 777 packages in 5s
```

Verification — packages present in `package.json`:

```bash
docker compose run --rm app sh -c "cat package.json | grep -E \"class-validator|class-transformer|mapped-types\""
```

```text
"@nestjs/mapped-types": "^2.0.6",
"class-transformer": "^0.5.1",
"class-validator": "^0.14.1",
```

### Exercise 2 — Global ValidationPipe

`src/main.ts` updated with `ValidationPipe` options: `whitelist`, `forbidNonWhitelisted`, `transform`.

Restart and logs:

```bash
docker compose restart app
docker compose logs -f app
```

```text
[3:29:41 PM] Found 0 errors. Watching for file changes.
[Nest] LOG [NestApplication] Nest application successfully started
```

### Exercise 3 — Category DTOs

Files created:
- `src/categories/dto/create-category.dto.ts` — `@IsString`, `@MinLength(2)`, `@MaxLength(100)`, `@IsOptional`
- `src/categories/dto/update-category.dto.ts` — `extends PartialType(CreateCategoryDto)`

### Exercise 4 — Product DTOs

Files created:
- `src/products/dto/create-product.dto.ts` — full validation with `@IsNumber({ maxDecimalPlaces: 2 })`, `@Min(0.01)`, `@IsInt`, `@Min(0)`
- `src/products/dto/update-product.dto.ts` — `extends PartialType(CreateProductDto)`

### Exercise 5 — Updated Categories controller & service

`body: { name: string; description?: string }` and `Partial<>` replaced with `CreateCategoryDto` / `UpdateCategoryDto`.

### Exercise 6 — Updated Products controller & service

`body: any` and inline types replaced with `CreateProductDto` / `UpdateProductDto`.

### Validation test results

**POST valid category:**

```bash
curl -s -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics","description":"Gadgets and devices"}'
```

```json
{"id":6,"name":"Electronics","description":"Gadgets and devices","createdAt":"2026-04-20T15:29:59.962Z"}
```

**POST invalid category (name too short — 400 Bad Request):**

```bash
curl -s -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"A"}'
```

```json
{"message":["name must be longer than or equal to 2 characters"],"error":"Bad Request","statusCode":400}
```

**POST category with unknown field (forbidNonWhitelisted — 400 Bad Request):**

```bash
curl -s -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Books","isAdmin":true}'
```

```json
{"message":["property isAdmin should not exist"],"error":"Bad Request","statusCode":400}
```

**POST valid product:**

```bash
curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop Pro","price":999.99,"stock":10,"categoryId":6}'
```

```json
{"id":4,"name":"Laptop Pro","description":null,"price":999.99,"stock":10,"isActive":true,"category":{"id":6},"createdAt":"2026-04-20T15:30:09.821Z","updatedAt":"2026-04-20T15:30:09.821Z"}
```

**POST invalid product (price=0 — 400 Bad Request):**

```bash
curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop Pro","price":0}'
```

```json
{"message":["price must not be less than 0.01"],"error":"Bad Request","statusCode":400}
```

**POST invalid product (name missing — 400 Bad Request):**

```bash
curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"price":10}'
```

```json
{"message":["name must be shorter than or equal to 255 characters","name must be longer than or equal to 2 characters","name must be a string"],"error":"Bad Request","statusCode":400}
```

---

## Practical #5 — JWT Authentication + Guards + RBAC

### Repository structure

```
.
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── auth.controller.ts
│   ├── users/
│   │   ├── user.entity.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── common/
│   │   ├── enums/
│   │   │   └── role.enum.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── decorators/
│   │       ├── current-user.decorator.ts
│   │       └── roles.decorator.ts
│   └── migrations/
│       └── 1776700258089-CreateUsers.ts
```

### Exercise 1 — Install packages

```bash
docker compose exec app npm install @nestjs/jwt bcrypt
docker compose exec app npm install -D @types/bcrypt
```

Output:
```text
added 18 packages, and audited 795 packages in 6s
added 1 package, and audited 796 packages in 5s
```

### Exercise 2 — users table verification

```bash
docker compose exec postgres psql -U nestuser -d nestdb -c "\d users"
```

```text
                                         Table "public.users"
    Column    |            Type             | Collation | Nullable |              Default
--------------+-----------------------------+-----------+----------+-----------------------------------
 id           | integer                     |           | not null | nextval('users_id_seq'::regclass)
 email        | character varying           |           | not null |
 passwordHash | character varying           |           | not null |
 name         | character varying(100)      |           |          |
 role         | users_role_enum             |           | not null | 'user'::users_role_enum
 createdAt    | timestamp without time zone |           | not null | now()
```

### Test results (Exercise 10)

**1. Register new user — 201 Created (no passwordHash in response):**

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password123", "name": "Admin"}'
```

```json
{"id":1,"email":"admin@test.com","name":"Admin","role":"user","createdAt":"2026-04-20T16:05:08.324Z"}
```

**2. Duplicate email — 409 Conflict:**

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "otherpass123"}'
```

```json
{"message":"User with this email already exists","error":"Conflict","statusCode":409}
```

**3. Login — 200 OK with accessToken:**

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password123"}'
```

```json
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

**4. Wrong password — 401 Unauthorized:**

```json
{"message":"Invalid credentials","error":"Unauthorized","statusCode":401}
```

**5. GET /api/products without token — 200 OK (public):**

```bash
curl http://localhost:3000/api/products
# returns array of products
```

**6. POST /api/products without token — 401 Unauthorized:**

```bash
curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Hacked Product", "price": 1}'
```

```json
{"message":"Missing authorization token","error":"Unauthorized","statusCode":401}
```

**7. POST /api/products with USER token — 403 Forbidden:**

```json
{"message":"Insufficient permissions","error":"Forbidden","statusCode":403}
```

**8. POST /api/products with ADMIN token — 201 Created:**

```bash
curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"name": "MacBook Pro", "price": 2499.99, "stock": 10}'
```

```json
{"id":5,"name":"MacBook Pro","description":null,"price":2499.99,"stock":10,"isActive":true,"category":null,"createdAt":"2026-04-20T16:05:45.489Z","updatedAt":"2026-04-20T16:05:45.489Z"}
```

**9. Set admin role in DB:**

```bash
docker compose exec postgres psql -U nestuser -d nestdb \
  -c "UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';"
```

---

## Practical #6 — Interceptors + Exception Filters + Swagger

### Repository structure (additions)

```
src/
├── common/
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   └── filters/
│       └── http-exception.filter.ts
```

### Exercise 1 — LoggingInterceptor

Global interceptor registered in `main.ts`. Logs each request:

```text
[HTTP] GET /api/categories — 200 — 14ms
[HTTP] POST /auth/register — 201 — 42ms
```

### Exercise 2 — TransformInterceptor

Wraps all successful responses in:

```json
{ "data": <original payload>, "statusCode": 200, "timestamp": "2026-04-20T16:53:37.000Z" }
```

Swagger UI path (`/api/docs`) is excluded from wrapping to avoid breaking static assets.

**Example — GET /api/categories:**

```json
{
  "data": [
    { "id": 4, "name": "Phone Accessories", "description": null, "createdAt": "2026-03-31T09:34:20.342Z" },
    { "id": 6, "name": "Electronics", "description": "Gadgets and devices", "createdAt": "2026-04-20T15:29:59.962Z" }
  ],
  "statusCode": 200,
  "timestamp": "2026-04-20T16:53:37.000Z"
}
```

### Exercise 3 — HttpExceptionFilter

`@Catch()` global filter. Generates a `traceId` (`randomUUID()`) per request. Returns unified error shape:

```json
{
  "error": { "code": <status>, "message": "...", "details": [...], "traceId": "<uuid>" },
  "timestamp": "2026-04-20T16:54:08.721Z"
}
```

**404 Not Found:**

```bash
curl -s http://localhost:3000/api/products/999
```

```json
{
  "error": {
    "code": 404,
    "message": "Product #999 not found",
    "traceId": "ecb45a04-4709-42c3-ae99-b6a6b174628d"
  },
  "timestamp": "2026-04-20T16:54:08.721Z"
}
```

**400 Validation failed:**

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"notanemail","password":"short"}'
```

```json
{
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": [
      "email must be an email",
      "password must be longer than or equal to 8 characters"
    ],
    "traceId": "df4b7fab-83ac-4661-aa39-b2b53e17271d"
  },
  "timestamp": "2026-04-20T16:54:39.337Z"
}
```

**Error log in console (with traceId):**

```text
[Exception] [df4b7fab-83ac-4661-aa39-b2b53e17271d] POST /auth/register — 400 — Validation failed
```

### Exercise 4 — Swagger / OpenAPI

Install:

```bash
docker compose exec app npm install @nestjs/swagger swagger-ui-express
```

`DocumentBuilder` configured in `main.ts`, UI served at `/api/docs`. Swagger CLI plugin added to `nest-cli.json` for auto type inference.

**Swagger UI screenshot:**

![Swagger UI](./swagger-screenshot.png)

Swagger docs available at: http://localhost:3000/api/docs
