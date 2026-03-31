# hlpf-env-setup

## Student

- Kononenko D.A;

- Group: 232/1;

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
