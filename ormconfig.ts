import { join } from 'path';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config();

// Конфигурация для Postgres
export const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env['PG_HOST'],
  port: Number(process.env['PG_PORT']),
  database: process.env['PG_NAME'],
  username: process.env['PG_USER'],
  password: process.env['PG_PASSWORD'],
  cache: process.env['PG_CACHE'] === 'true',
  synchronize: process.env['PG_SYNCHRONIZE'] === 'true',
  entities: [join(__dirname, '**', '*.entity{.js, .ts}')],
  migrations: [join(__dirname, 'src', 'database', 'migrations', '*{.ts, .js}')],
  uuidExtension: 'uuid-ossp',
};

// инстанс с конфигом для работы с миграциями через TypeOrm CLI
export const PostgresDataSource = new DataSource(
  postgresConfig as DataSourceOptions,
);
