import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { UserProfileResponse } from './dto/user-profile-response.dto';
import { UserDto } from './dto/user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async findAll() {
    const users = await this.usersService.findAll();

    const usersProfileResponseDto = plainToInstance(UserProfileResponse, users);

    return usersProfileResponseDto;
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOneById(@Param('id') id: UserDto['id']) {
    const user = this.usersService.findOneById(id);

    const userProfileResponseDto = plainToInstance(UserProfileResponse, user);

    return userProfileResponseDto;
  }
}
