import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const ds = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

async function seed() {
  await ds.initialize();

  const cats = ['Electronics', 'Accessories', 'Clothing'];
  for (const name of cats) {
    await ds.query(
      `INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING`,
      [name],
    );
  }

  const catRows = await ds.query(`SELECT id, name FROM categories WHERE name = ANY($1)`, [cats]);
  const catMap: Record<string, number> = {};
  for (const row of catRows) {
    catMap[row.name] = row.id;
  }

  const products = [
    { name: 'iPhone 16', price: 999, stock: 50, cat: catMap['Electronics'] },
    { name: 'Galaxy S24', price: 849, stock: 40, cat: catMap['Electronics'] },
    { name: 'MacBook Pro', price: 2499, stock: 15, cat: catMap['Electronics'] },
    { name: 'iPad Air', price: 599, stock: 30, cat: catMap['Electronics'] },
    { name: 'AirPods Pro', price: 249, stock: 100, cat: catMap['Accessories'] },
    { name: 'USB-C Cable', price: 19, stock: 500, cat: catMap['Accessories'] },
    { name: 'MagSafe Charger', price: 39, stock: 80, cat: catMap['Accessories'] },
    { name: 'Laptop Sleeve', price: 49, stock: 60, cat: catMap['Accessories'] },
    { name: 'T-Shirt Dev', price: 25, stock: 200, cat: catMap['Clothing'] },
    { name: 'Hoodie NestJS', price: 55, stock: 75, cat: catMap['Clothing'] },
  ];

  for (let i = 0; i < 3; i++) {
    for (const p of products) {
      const suffix = i > 0 ? ` v${i + 1}` : '';
      await ds.query(
        `INSERT INTO products (name, price, stock, category_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [`${p.name}${suffix}`, p.price + i * 10, p.stock, p.cat],
      );
    }
  }

  console.log('Seed complete: 3 categories, 30 products');
  await ds.destroy();
}

seed().catch(console.error);
