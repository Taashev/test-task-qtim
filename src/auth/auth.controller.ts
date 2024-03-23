import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserProfileResponse } from 'src/users/dto/user-profile-response.dto';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

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
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    const jwt = await this.authService.auth(signInDto);

    return jwt;
  }
}
