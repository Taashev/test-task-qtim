import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';

import { UserEntity } from 'src/users/entities/user.entity';
import { MESSAGE_ERROR } from 'src/utils/constants';
import { RedisPostsService } from 'src/redis/redis-posts.service';

import { PostEntity } from './entities/post.entity';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsPaginationDto } from './dto/posts-pagination.dto';
import { PostsFilterDto } from './dto/posts-filter.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly redisPostsService: RedisPostsService,
  ) {}

  async create(createPostDto: CreatePostDto, user: UserEntity) {
    const createPost = await this.postsRepository.create(createPostDto);

    createPost.owner = user;

    const post = await this.postsRepository.save(createPost);

    await this.redisPostsService.del('all');

    await this.redisPostsService.reset('list:');

    return post;
  }

  async findAll(options?: FindManyOptions<PostEntity>) {
    const posts = await this.postsRepository.findAll(options);

    return posts;
  }

  async findOneById(
    postId: PostDto['id'],
    options?: FindOneOptions<PostEntity>,
  ) {
    const post = await this.postsRepository.findOneById(postId, options);

    if (!post) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND_POST);
    }

    return post;
  }

  async update(postId: PostDto['id'], updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.update(postId, updatePostDto);

    await this.redisPostsService.del('all');
    await this.redisPostsService.del(postId, 'id:');

    await this.redisPostsService.reset('list:');

    return post;
  }

  async delete(postId: PostDto['id']) {
    const deleteResult = await this.postsRepository.delete(postId);

    if (!deleteResult.affected) {
      throw new BadRequestException(MESSAGE_ERROR.BAD_REQUEST_DELETE_POST);
    }

    await this.redisPostsService.del(postId, 'id:');
    await this.redisPostsService.del('all');

    await this.redisPostsService.reset('list:');
  }

  async filterPosts(optionsFilter: PostsPaginationDto & PostsFilterDto) {
    const posts = await this.postsRepository.filterPosts(optionsFilter);

    return posts;
  }
}
