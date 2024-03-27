import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, of } from 'rxjs';

import { RedisPostsService, SubPrefix } from 'src/redis/redis-posts.service';
import { PostsPaginationDto } from '../dto/posts-pagination.dto';
import { plainToInstance } from 'class-transformer';
import { PostsFilterDto } from '../dto/posts-filter.dto';

@Injectable()
export class PostsCacheInterceptor implements NestInterceptor {
  constructor(private readonly redisPostsService: RedisPostsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const http = context.switchToHttp();
    const req = http.getRequest();

    const { key, subPrefix } = this.getCacheKey(req);

    const cacheAllPosts = await this.redisPostsService.get(key, subPrefix);

    if (cacheAllPosts) {
      return of(cacheAllPosts);
    }

    return next.handle();
  }

  private getCacheKey(req: Request): { subPrefix: SubPrefix; key: string } {
    const { query, params, body, method, path } = req;

    let key = 'all';

    let subPrefix: SubPrefix = '';

    if (method === 'GET' && params.id) {
      subPrefix = 'id:';
      key = params.id;
    } else if (method === 'POST' && path.includes('/list')) {
      const postsPaginationDto = plainToInstance(PostsPaginationDto, query, {
        excludeExtraneousValues: true,
      });

      const postsFilterDto = plainToInstance(PostsFilterDto, body, {
        excludeExtraneousValues: true,
      });

      subPrefix = 'list:';
      key = JSON.stringify({ ...postsPaginationDto, ...postsFilterDto });
    }

    return { subPrefix, key };
  }
}
