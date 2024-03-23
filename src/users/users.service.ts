import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const createUser = await this.usersRepository.create(createUserDto);

    const user = await this.usersRepository.save(createUser);

    return user;
  }

  async findAll() {
    return await this.usersRepository.findAll();
  }
}
