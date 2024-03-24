import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';

import { JwtGuard } from 'src/guards/jwt.guard';
import { PostResponseDto } from 'src/posts/dto/post-respoonse.dto';
import { MESSAGE_ERROR } from 'src/utils/constants';

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

  @Get('me/posts')
  @UseGuards(JwtGuard)
  async getPosts(@Req() req: Request) {
    const user = await this.usersService.findOneById(req.user.id, {
      posts: true,
    });

    if (!user) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND_USER);
    }

    const posts = user.posts;

    const postsResponseDto = plainToInstance(PostResponseDto, posts);

    return postsResponseDto;
  }

  @Get(':username')
  @UseGuards(JwtGuard)
  async findOneByUsername(@Param('username') username: UserDto['username']) {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND_USER);
    }

    const userProfileResponseDto = plainToInstance(UserProfileResponse, user);

    return userProfileResponseDto;
  }

  @Get(':username/posts')
  async getUsernamePosts(@Param('username') username: UserDto['username']) {
    const user = await this.usersService.findOneByUsername(username, {
      posts: true,
    });

    if (!user) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND_USER);
    }

    const posts = user.posts;

    const postsResponseDto = plainToInstance(PostResponseDto, posts);

    return postsResponseDto;
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAll() {
    const users = await this.usersService.findAll();

    const usersProfileResponseDto = plainToInstance(UserProfileResponse, users);

    return usersProfileResponseDto;
  }
}
