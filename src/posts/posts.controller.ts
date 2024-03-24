import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';

import { JwtGuard } from 'src/guards/jwt.guard';
import { UserProfileResponse } from 'src/users/dto/user-profile-response.dto';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { IsOwnerPostInterceptor } from './interceptors/is-owner-post.interceptor';
import { PostResponseDto } from './dto/post-respoonse.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPaginationDto } from './dto/query-pagination.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  async findOneById(@Param('id') postId: PostDto['id']) {
    const post = await this.postsService.findOneById(postId, { owner: true });

    const postResponseDto = plainToInstance(PostResponseDto, post);

    postResponseDto.owner = plainToInstance(UserProfileResponse, post.owner);

    return postResponseDto;
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(IsOwnerPostInterceptor)
  async update(
    @Param('id') postId: PostDto['id'],
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postsService.update(postId, updatePostDto);

    const updatedPost = await this.postsService.findOneById(postId, {
      owner: true,
    });

    const postResponseDto = plainToInstance(PostResponseDto, updatedPost);

    postResponseDto.owner = plainToInstance(
      UserProfileResponse,
      postResponseDto.owner,
    );

    return postResponseDto;
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(IsOwnerPostInterceptor)
  async delete(@Param('id') postId: PostDto['id']) {
    await this.postsService.delete(postId);

    return {};
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    const user = req.user;

    const post = await this.postsService.create(createPostDto, user);

    return post;
  }

  @Get()
  async findAll(@Query() query: QueryPaginationDto) {
    const posts = await this.postsService.findAll({
      owner: true,
      skip: query.offset,
      take: query.limit,
    });

    const postsResponseDto = plainToInstance(PostResponseDto, posts);

    const postsResponse = postsResponseDto.map((post) => {
      post.owner = plainToInstance(UserProfileResponse, post.owner);
      return post;
    });

    return postsResponse;
  }
}
