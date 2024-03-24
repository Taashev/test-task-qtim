import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserProfileResponse } from 'src/users/dto/user-profile-response.dto';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/post-respoonse.dto';
import { PostDto } from './dto/post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    const user = req.user;

    const post = await this.postsService.create(createPostDto, user);

    return post;
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAll() {
    const posts = await this.postsService.findAll({ owner: true });

    const postsResponseDto = plainToInstance(PostResponseDto, posts);

    const postsResponse = postsResponseDto.map((post) => {
      post.owner = plainToInstance(UserProfileResponse, post.owner);
      return post;
    });

    return postsResponse;
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findOneById(@Param('id') id: PostDto['id']) {
    const post = await this.postsService.findOneById(id, { owner: true });

    const postResponseDto = plainToInstance(PostResponseDto, post);

    postResponseDto.owner = plainToInstance(UserProfileResponse, post.owner);

    return postResponseDto;
  }
}