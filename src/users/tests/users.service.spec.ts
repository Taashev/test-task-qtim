import * as bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UsersService } from '../users.service';
import { UserEntity } from '../entities/user.entity';

import { hashPasswordMock, user1Mock, usersMock } from './mock/users.mock';
import { UsersRepositoryProviderMock } from './mock/users.repository.mock';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const UsersModuleRef = await Test.createTestingModule({
      providers: [UsersService, UsersRepositoryProviderMock],
    }).compile();

    // при вызове bcrypt.hash в сервисе будем отдавать замоканый результат вместо хеша
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
