import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';

import { LocalGuard } from 'src/guards/local.guard';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserProfileResponse } from 'src/users/dto/user-profile-response.dto';

import { AuthService } from './auth.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    const userProfileResponseDto = plainToInstance(UserProfileResponse, user);

    return userProfileResponseDto;
  }

  @Post('signin')
  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  signIn(@Req() req: Request) {
    const user = req.user;

    const jwt = this.authService.auth(user.id);

    return jwt;
  }
}
