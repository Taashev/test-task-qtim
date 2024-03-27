import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from 'src/redis/redis.module';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostEntity } from './entities/post.entity';
import { IsOwnerPostInterceptor } from './interceptors/is-owner-post.interceptor';
import { PostsCacheInterceptor } from './interceptors/posts-cache.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), RedisModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    IsOwnerPostInterceptor,
    PostsCacheInterceptor,
  ],
})
export class PostsModule {}
