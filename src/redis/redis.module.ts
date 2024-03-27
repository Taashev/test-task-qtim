import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { redisConfig } from 'src/configs/redis.config';

import { RedisPostsService } from './redis-posts.service';

@Module({
  imports: [CacheModule.registerAsync(redisConfig)],
  providers: [RedisPostsService],
  exports: [RedisPostsService],
})
export class RedisModule {}
