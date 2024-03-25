import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';

import { UserEntity } from 'src/users/entities/user.entity';
import { MESSAGE_ERROR } from 'src/utils/constants';

import { PostEntity } from './entities/post.entity';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationPostsDto } from './dto/pagination-posts.dto';
import { FilterPostsDto } from './dto/filter-posts.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(createPostDto: CreatePostDto, user: UserEntity) {
    const createPost = await this.postsRepository.create(createPostDto);

    createPost.owner = user;

    const post = await this.postsRepository.save(createPost);

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

    return post;
  }

  async delete(postId: PostDto['id']) {
    const deleteResult = await this.postsRepository.delete(postId);

    if (!deleteResult.affected) {
      throw new BadRequestException(MESSAGE_ERROR.BAD_REQUEST_DELETE_POST);
    }
  }

  async filter(optionsFilter: PaginationPostsDto & FilterPostsDto) {
    const queryBuilder = this.postsRepository.createQueryBuilder('post');

    queryBuilder.leftJoinAndSelect('post.owner', 'user');

    if (optionsFilter.author) {
      queryBuilder.andWhere('user.username = :username', {
        username: optionsFilter.author,
      });
    }

    if (optionsFilter.title) {
      queryBuilder.andWhere('post.title LIKE :title', {
        title: `%${optionsFilter.title}%`,
      });
    }

    if (optionsFilter.createdAt) {
      queryBuilder.andWhere('post.createdAt :: date = :date', {
        date: optionsFilter.createdAt,
      });
    }

    if (optionsFilter.offset) {
      queryBuilder.skip(optionsFilter.offset);
    }

    if (optionsFilter.limit) {
      queryBuilder.take(optionsFilter.limit);
    }

    const [posts, count] = await queryBuilder.getManyAndCount();

    return { posts, count };
  }
}
