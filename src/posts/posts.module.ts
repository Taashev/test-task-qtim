import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostEntity } from './entities/post.entity';
import { IsOwnerPostInterceptor } from './interceptors/is-owner-post.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, IsOwnerPostInterceptor],
})
export class PostsModule {}
