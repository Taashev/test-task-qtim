import { join } from 'path';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { TypeOrmConfig } from 'src/database/types/typeorm';

dotenv.config();

// Конфигурация для Postgres
export const postgresConfig: TypeOrmConfig = {
  type: 'postgres',
  host: process.env['PG_HOST'],
  port: Number(process.env['PG_PORT']),
  database: process.env['PG_NAME'],
  username: process.env['PG_USER'],
  password: process.env['PG_PASSWORD'],
  synchronize: process.env['PG_SYNCHRONIZE'] === 'true',
  entities: [join(__dirname, '..', '**', '*.entity{.ts, .js}')],
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts, .js}')],
};

// инстанс с конфигом для работы с миграциями через TypeOrm CLI
export const PostgresDataSource = new DataSource(
  postgresConfig as DataSourceOptions,
);
