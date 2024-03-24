import { Injectable } from '@nestjs/common';

import { UserEntity } from 'src/users/entities/user.entity';

import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';

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

    return post;
  }
}
