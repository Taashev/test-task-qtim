import {
  Body,
  ClassSerializerInterceptor,
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
import { RedisPostsService } from 'src/redis/redis-posts.service';

import { PostsService } from './posts.service';
import { IsOwnerPostInterceptor } from './interceptors/is-owner-post.interceptor';
import { PostsCacheInterceptor } from './interceptors/posts-cache.interceptor';
import { PostDto } from './dto/post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-respoonse.dto';
import { PostsPaginationDto } from './dto/posts-pagination.dto';
import { PostsFilterDto } from './dto/posts-filter.dto';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly redisPostsService: RedisPostsService,
  ) {}

  @Get()
  @UseInterceptors(PostsCacheInterceptor)
  async findAll() {
    const posts = await this.postsService.findAll({
      relations: { owner: true },
    });
    const postsResponseDto = plainToInstance(PostResponseDto, posts);

    await this.redisPostsService.set('all', postsResponseDto);

    return postsResponseDto;
  }

  @Get(':id')
  @UseInterceptors(PostsCacheInterceptor)
  async findOneById(@Param('id') postId: PostDto['id']) {
    const post = await this.postsService.findOneById(postId, {
      relations: { owner: true },
    });
    const postResponseDto = plainToInstance(PostResponseDto, post);

    postResponseDto.owner = plainToInstance(UserProfileResponse, post.owner);

    await this.redisPostsService.set(postId, postResponseDto, {
      subPrefix: 'id:',
    });

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
  @UseInterceptors(PostsCacheInterceptor)
  async findList(
    @Query() paginationPostsDto: PostsPaginationDto,
    @Body() filterPostsDto: PostsFilterDto,
  ) {
    console.log('no cache');

    const optionsFilter = { ...paginationPostsDto, ...filterPostsDto };

    const { posts, count } = await this.postsService.filterPosts(optionsFilter);

    const postsResponseDto = {
      posts: plainToInstance(PostResponseDto, posts),
      count,
    };

    await this.redisPostsService.set(
      JSON.stringify(optionsFilter),
      postsResponseDto,
      { subPrefix: 'list:' },
    );

    return postsResponseDto;
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
