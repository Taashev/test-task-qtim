import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  TypeORMError,
} from 'typeorm';
import { validate } from 'class-validator';

import { TypeOrmException } from 'src/exceptions/typeorm.exception';
import { MESSAGE_ERROR } from 'src/utils/constants';

import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostsDto } from './dto/filter-posts.dto';
import { PaginationPostsDto } from './dto/pagination-posts.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const errors = await validate(createPostDto);

      if (errors.length > 0) {
        throw new BadRequestException(MESSAGE_ERROR.BAD_REQUEST);
      }

      const createPost = this.postsRepository.create(createPostDto);

      return createPost;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async save(postEntity: PostEntity) {
    try {
      const post = await this.postsRepository.save(postEntity);

      return post;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async findAll(options?: FindManyOptions<PostEntity>) {
    try {
      const posts = this.postsRepository.find(options);

      return posts;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async findOneById(
    postId: PostDto['id'],
    options?: FindOneOptions<PostEntity>,
  ) {
    try {
      const post = await this.postsRepository.findOne({
        where: { id: postId },
        ...options,
      });

      return post;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async update(postId: PostDto['id'], updatePostDto: UpdatePostDto) {
    try {
      const post = await this.postsRepository.update(postId, updatePostDto);

      return post;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async delete(postId: PostDto['id']) {
    try {
      const deleteResult = await this.postsRepository.delete(postId);

      return deleteResult;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async filterPosts(optionsFilter: PaginationPostsDto & FilterPostsDto) {
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
