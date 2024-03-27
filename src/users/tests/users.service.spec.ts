import * as bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';

import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';

import { hashPasswordMock, user1Mock, usersMock } from './mock/users-data.mock';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepositoryMock: Partial<UsersRepository>;

  beforeEach(async () => {
    usersRepositoryMock = {
      create: jest
        .fn()
        .mockImplementation(
          async (createUserDto: CreateUserDto) => createUserDto as UserEntity,
        ),
      save: jest.fn().mockImplementation(async (userEntity: UserEntity) => {
        const user: UserEntity = {
          ...user1Mock,
          ...userEntity,
        };
        return user;
      }),
      findAll: jest.fn().mockImplementation(() => usersMock),
      findOneByUsername: jest
        .fn()
        .mockImplementation((username: string) =>
          usersMock.find((user) => user.username === username),
        ),
      findOneById: jest
        .fn()
        .mockImplementation((userId: string) =>
          usersMock.find((user) => user.id === userId),
        ),
    };

    const UsersModuleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashPasswordMock as never);

    usersService = await UsersModuleRef.get(UsersService);
  });

  describe('create - метод создания пользователя', () => {
    it('пользователь создан успешно', async () => {
      const createUserDto = {
        username: 'username',
        password: 'password',
      };

      const expectResult: UserEntity = {
        ...user1Mock,
        ...createUserDto,
        password: hashPasswordMock,
      };

      const user = await usersService.create(createUserDto);

      expect(user).toEqual(expectResult);
    });
  });

  describe('get - получение пользователей', () => {
    it('получить всех пользователей', async () => {
      const users = await usersService.findAll();

      expect(users).toEqual(usersMock);
    });

    it('получить пользователя по username', async () => {
      const user = await usersService.findOneByUsername('username1');

      const expectResult = usersMock[0];

      expect(user).toEqual(expectResult);
    });

    it('выбросить NotFoundException, если пользователь по username не найден', async () => {
      await expect(usersService.findOneByUsername('username0')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('получить пользователя по id', async () => {
      const user = await usersService.findOneByIdOrFail('2');

      const expectResult = usersMock[1];

      expect(user).toEqual(expectResult);
    });

    it('выбросить NotFoundException, если пользователь по id не найден', async () => {
      await expect(usersService.findOneByIdOrFail('username0')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
