import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
import { validate } from 'class-validator';

import { TypeOrmException } from 'src/exceptions/typeorm.exception';

import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { MESSAGE_ERROR } from 'src/utils/constants';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const errors = await validate(createUserDto);

      if (errors.length > 0) {
        throw new BadRequestException(MESSAGE_ERROR.BAD_REQUEST);
      }

      return this.usersRepository.create(createUserDto);
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async save(user: UserEntity): Promise<UserEntity> {
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async findAll() {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }
}
