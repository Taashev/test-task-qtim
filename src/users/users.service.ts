import * as bcrypt from 'bcrypt';
import { FindOneOptions } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MESSAGE_ERROR } from 'src/utils/constants';

import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createUser = await this.usersRepository.create(createUserDto);

    const salt = this.configService.get('HASH_PASSWORD_SALT');

    const hashPassword = await bcrypt.hash(createUser.password, salt);

    createUser.password = hashPassword;

    const user = await this.usersRepository.save(createUser);

    return user;
  }

  async findAll() {
    const users = await this.usersRepository.findAll();

    return users;
  }

  async findOneByUsername(
    username: UserDto['username'],
    options?: FindOneOptions<UserEntity>,
  ) {
    const user = await this.usersRepository.findOneByUsername(
      username,
      options,
    );

    if (!user) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND_USER);
    }

    return user;
  }

  async findOneById(
    userId: UserDto['id'],
    options?: FindOneOptions<UserEntity>,
  ) {
    const user = await this.usersRepository.findOneById(userId, options);

    return user;
  }

  async findOneByIdOrFail(
    userId: UserDto['id'],
    options?: FindOneOptions<UserEntity>,
  ) {
    const user = await this.usersRepository.findOneById(userId, options);

    if (!user) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND_USER);
    }

    return user;
  }
}
