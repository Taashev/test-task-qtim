import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { postgresConfig } from 'src/configs/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => postgresConfig,
    }),
  ],
})
export class DatabaseModule {}
