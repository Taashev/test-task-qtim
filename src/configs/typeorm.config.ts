import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const postgresConfig: (
  ...args: any[]
) => TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> = (
  configService: ConfigService,
) => {
  return {
    type: 'postgres',
    host: configService.get('PG_HOST'),
    port: configService.get('PG_PORT'),
    database: configService.get('PG_NAME'),
    username: configService.get('PG_USER'),
    password: configService.get('PG_PASSWORD'),
    synchronize: configService.get('PG_SYNCHRONIZE') === true,
    entities: [join(__dirname, '**', '*.entity{.ts, .js}')],
  };
};
