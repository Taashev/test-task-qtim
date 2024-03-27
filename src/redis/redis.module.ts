import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { getRedisConfig } from 'src/configs/redis.config';

import { RedisPostsService } from './redis-posts.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        getRedisConfig(configService),
    }),
  ],
  providers: [RedisPostsService],
  exports: [RedisPostsService],
})
export class RedisModule {}
