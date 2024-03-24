import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
import { validate } from 'class-validator';

import { TypeOrmException } from 'src/exceptions/typeorm.exception';
import { MESSAGE_ERROR } from 'src/utils/constants';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

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

      const createUser = this.usersRepository.create(createUserDto);

      return createUser;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async save(userEntity: UserEntity): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.save(userEntity);

      return user;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async findAll() {
    try {
      const users = await this.usersRepository.find();

      return users;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async findOneByUsername(username: UserDto['username']) {
    try {
      const user = await this.usersRepository.findOne({ where: { username } });

      return user;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }

  async findOneById(id: UserDto['id']) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      return user;
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new TypeOrmException(error);
      }

      throw error;
    }
  }
}
