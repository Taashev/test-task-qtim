import { ConfigService } from '@nestjs/config';

export const postConfig = {
  title: { minLength: 2, maxLength: 50 },
  description: { minLength: 20, maxLength: 2000 },
};

export const getPostCacheConfig = (configService: ConfigService) => ({
  ttl: configService.get('CACHE_TTL_POST'),
  max: configService.get('CACHE_MAX_POST'),
});
