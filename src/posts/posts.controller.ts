import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { IsOwnerPostInterceptor } from './interceptors/is-owner-post.interceptor';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-respoonse.dto';
import { PaginationPostsDto } from './dto/pagination-posts.dto';
import { FilterPostsDto } from './dto/filter-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    const posts = await this.postsService.findAll({
      relations: { owner: true },
    });

    const postsResponseDto = plainToInstance(PostResponseDto, posts);

    const postsResponse = postsResponseDto.map((post) => {
      post.owner = plainToInstance(UserProfileResponse, post.owner);
      return post;
    });

    return postsResponse;
  }

  @Get(':id')
  async findOneById(@Param('id') postId: PostDto['id']) {
    const post = await this.postsService.findOneById(postId, {
      relations: { owner: true },
    });

    const postResponseDto = plainToInstance(PostResponseDto, post);

    postResponseDto.owner = plainToInstance(UserProfileResponse, post.owner);

    return postResponseDto;
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    const user = req.user;

    const post = await this.postsService.create(createPostDto, user);

    return post;
  }

  @Post('list')
  @HttpCode(HttpStatus.OK)
  async findList(@Query() paginationPostsDto: PaginationPostsDto) {
    const { offset, limit } = paginationPostsDto;

    const [posts, count] = await this.postsService.findOffset(offset, limit, {
      relations: { owner: true },
    });

    const postsResponseDto = plainToInstance(PostResponseDto, posts);

    const postsResponse = postsResponseDto.map((post) => {
      post.owner = plainToInstance(UserProfileResponse, post.owner);
      return post;
    });

    return { posts: postsResponse, count };
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UseInterceptors(IsOwnerPostInterceptor)
  async update(
    @Param('id') postId: PostDto['id'],
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postsService.update(postId, updatePostDto);

    const updatedPost = await this.postsService.findOneById(postId);

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
}
