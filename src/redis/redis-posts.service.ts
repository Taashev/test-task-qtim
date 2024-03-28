import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

export type Prefix = 'posts:';
export type SubPrefix = 'id:' | 'list:' | '';
export type TTL = number;

@Injectable()
export class RedisPostsService {
  private prefix: Prefix = `posts:`;
  private subPrefix: SubPrefix = '';
  private ttl: TTL = 0;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(
    key: string,
    value: unknown,
    options: { ttl?: number; subPrefix?: SubPrefix } = {
      ttl: this.ttl,
      subPrefix: this.subPrefix,
    },
  ) {
    const { ttl = 0, subPrefix = this.subPrefix } = options;

    return await this.cacheManager.set(
      this.prefix + subPrefix + key,
      value,
      ttl,
    );
  }

  async get(key: string, subPrefix: SubPrefix = this.subPrefix) {
    return await this.cacheManager.get(this.prefix + subPrefix + key);
  }

  async del(key: string, subPrefix: SubPrefix = this.subPrefix) {
    return await this.cacheManager.del(this.prefix + subPrefix + key);
  }

  async reset(subPrefix: SubPrefix = this.subPrefix) {
    const client = this.cacheManager.store;

    const postKeys = await client.keys(this.prefix + subPrefix + '*');

    if (postKeys.length) {
      await client.mdel(...postKeys);
    }
  }
}
