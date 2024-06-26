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

import { JwtGuard } from 'src/guards/jwt.guard';
import { PostResponseDto } from 'src/posts/dto/post-respoonse.dto';

import { UsersService } from './users.service';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    const usersProfileResponseDto = plainToInstance(
      UserProfileResponseDto,
      users,
    );

    return usersProfileResponseDto;
  }

  @Get('me')
  @UseGuards(JwtGuard)
  findMe(@Req() req: Request) {
    const user = req.user;

    const userProfileResponseDto = plainToInstance(
      UserProfileResponseDto,
      user,
    );

    return userProfileResponseDto;
  }

  @Get('me/posts')
  @UseGuards(JwtGuard)
  async getPosts(@Req() req: Request) {
    const user = await this.usersService.findOneByIdOrFail(req.user.id, {
      relations: { posts: true },
    });

    const posts = user.posts;

    const postsResponseDto = plainToInstance(PostResponseDto, posts);

    return postsResponseDto;
  }

  @Get(':username')
  async findOneByUsername(@Param('username') username: UserDto['username']) {
    const user = await this.usersService.findOneByUsername(username);

    const userProfileResponseDto = plainToInstance(
      UserProfileResponseDto,
      user,
    );

    return userProfileResponseDto;
  }

  @Get(':username/posts')
  async getUsernamePosts(@Param('username') username: UserDto['username']) {
    const user = await this.usersService.findOneByUsername(username, {
      relations: { posts: true },
    });

    const posts = user.posts;

    const postsResponseDto = plainToInstance(PostResponseDto, posts);

    return postsResponseDto;
  }
}
