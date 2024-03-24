import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { SALT } from 'src/utils/constants';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { Relations } from './types/repository';

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
    relations?: Relations,
  ) {
    const user = await this.usersRepository.findOneByUsername(
      username,
      relations,
    );

    return user;
  }

  async findOneById(id: UserDto['id'], relations?: Relations) {
    const user = await this.usersRepository.findOneById(id, relations);

    return user;
  }
}
