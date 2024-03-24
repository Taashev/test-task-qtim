import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from 'src/users/entities/user.entity';
import { MESSAGE_ERROR } from 'src/utils/constants';

import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Options, Relations } from './types/repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(createPostDto: CreatePostDto, user: UserEntity) {
    const createPost = await this.postsRepository.create(createPostDto);

    createPost.owner = user;

    const post = await this.postsRepository.save(createPost);

    return post;
  }

  async findAll(options?: Options) {
    const posts = await this.postsRepository.findAll(options);

    return posts;
  }

  async findOneById(postId: PostDto['id'], relations?: Relations) {
    const post = await this.postsRepository.findOneById(postId, relations);

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
}
