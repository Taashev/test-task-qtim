import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { SALT } from 'src/utils/constants';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const createUser = await this.usersRepository.create(createUserDto);

    const hashPassword = await bcrypt.hash(createUser.password, SALT);

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
    options = { posts: false },
  ) {
    const user = await this.usersRepository.findOneByUsername(
      username,
      options,
    );

    return user;
  }

  async findOneById(id: UserDto['id'], options = { posts: false }) {
    const user = await this.usersRepository.findOneById(id, options);

    return user;
  }
}
