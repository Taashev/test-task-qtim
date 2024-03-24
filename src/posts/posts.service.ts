import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from 'src/users/entities/user.entity';

import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MESSAGE_ERROR } from 'src/utils/constants';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(createPostDto: CreatePostDto, user: UserEntity) {
    const createPost = await this.postsRepository.create(createPostDto);

    createPost.owner = user;

    const post = await this.postsRepository.save(createPost);

    return post;
  }

  async findAll(options = { owner: false }) {
    const posts = await this.postsRepository.findAll(options);

    return posts;
  }

  async findOneById(id: PostDto['id'], options = { owner: false }) {
    const post = await this.postsRepository.findOneById(id, options);

    if (!post) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND_POST);
    }

    return post;
  }

  async update(id: PostDto['id'], updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.update(id, updatePostDto);

    return post;
  }

  async delete(id: PostDto['id']) {
    const deleteResult = await this.postsRepository.delete(id);

    if (!deleteResult.affected) {
      throw new BadRequestException(MESSAGE_ERROR.BAD_REQUEST_DELETE_POST);
    }
  }
}
