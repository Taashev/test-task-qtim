import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PostResponseDto } from 'src/posts/dto/post-respoonse.dto';

import { UsersService } from './users.service';
import { UserProfileResponse } from './dto/user-profile-response.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  findMe(@Req() req: Request) {
    const user = req.user;

    const userProfileResponseDto = plainToInstance(UserProfileResponse, user);

    return userProfileResponseDto;
  }

  @Get('posts')
  @UseGuards(JwtGuard)
  async getPosts(@Req() req: Request) {
    const user = await this.usersService.findOneById(req.user.id, {
      posts: true,
    });

    const posts = user.posts;

    const postsResponseDto = plainToInstance(PostResponseDto, posts);

    return postsResponseDto;
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOneById(@Param('id') id: UserDto['id']) {
    const user = this.usersService.findOneById(id);

    const userProfileResponseDto = plainToInstance(UserProfileResponse, user);

    return userProfileResponseDto;
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAll() {
    const users = await this.usersService.findAll();

    const usersProfileResponseDto = plainToInstance(UserProfileResponse, users);

    return usersProfileResponseDto;
  }
}
