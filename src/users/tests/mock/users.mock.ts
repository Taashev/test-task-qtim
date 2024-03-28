import { UserEntity } from 'src/users/entities/user.entity';

export const dateMock = new Date('2001-01-01');
export const hashPasswordMock = 'hash_password';

export const user1Mock: UserEntity = {
  id: '1',
  createdAt: dateMock,
  updatedAt: dateMock,
  username: 'username1',
  password: 'password1',
  posts: [],
};

export const user2Mock: UserEntity = {
  id: '2',
  createdAt: dateMock,
  updatedAt: dateMock,
  username: 'username2',
  password: 'password2',
  posts: [],
};

export const user3Mock: UserEntity = {
  id: '3',
  createdAt: dateMock,
  updatedAt: dateMock,
  username: 'username3',
  password: 'password3',
  posts: [],
};

export const usersMock: UserEntity[] = [user1Mock, user2Mock, user3Mock];
