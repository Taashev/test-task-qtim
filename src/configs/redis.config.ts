import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

export const getRedisConfig = (configService: ConfigService) => ({
  store: redisStore,
  socket: {
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  },
  ttl: configService.get('CACHE_TTL'),
});
