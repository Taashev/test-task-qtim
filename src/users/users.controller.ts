import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { UserProfileResponse } from './dto/user-profile-response.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    const usersProfileResponseDto = plainToInstance(UserProfileResponse, users);

    return usersProfileResponseDto;
  }
}
