import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';

import { CreateTables1700000001000 } from './migrations/1700000001000-CreateTables';
import { AddIsActiveToProducts1774946888433 } from './migrations/1774946888433-AddIsActiveToProducts';
import { CreateUsers1776700258089 } from './migrations/1776700258089-CreateUsers';
import { CreateOrders1776760961759 } from './migrations/1776760961759-CreateOrders';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Category, Product, User, Order, OrderItem],
      synchronize: false,
      migrationsRun: true,
      migrations: [
        CreateTables1700000001000,
        AddIsActiveToProducts1774946888433,
        CreateUsers1776700258089,
        CreateOrders1776760961759,
      ],
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        stores: [
          new Keyv({
            store: new KeyvRedis(
              `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT ?? '6379'}`,
            ),
            namespace: 'cache',
          }),
        ],
        ttl: 60_000,
      }),
    }),

    CategoriesModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
