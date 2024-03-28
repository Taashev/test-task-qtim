import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';

import { usersMock, user1Mock } from './users.mock';

export const usersRepositoryMock: Partial<UsersRepository> = {
  create: jest
    .fn()
    .mockImplementation(
      async (createUserDto: CreateUserDto) => createUserDto as UserEntity,
    ),

  save: jest.fn().mockImplementation(async (createUser: UserEntity) => {
    const user: UserEntity = {
      ...user1Mock,
      ...createUser,
    };
    return user;
  }),

  findAll: jest.fn().mockImplementation(async () => usersMock),

  findOneByUsername: jest
    .fn()
    .mockImplementation(async (username: string) =>
      usersMock.find((user) => user.username === username),
    ),

  findOneById: jest
    .fn()
    .mockImplementation(async (userId: string) =>
      usersMock.find((user) => user.id === userId),
    ),
};

export const UsersRepositoryProviderMock = {
  provide: UsersRepository,
  useValue: usersRepositoryMock,
};
