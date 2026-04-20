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
