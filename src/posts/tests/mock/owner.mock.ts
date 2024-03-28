import { UserEntity } from 'src/users/entities/user.entity';

const dateMock = new Date('2001-01-01');

export const owner1Mock: UserEntity = {
  id: '1',
  createdAt: dateMock,
  updatedAt: dateMock,
  username: 'username1',
  password: 'hash_password',
  posts: null,
};

export const owner2Mock: UserEntity = {
  id: '2',
  createdAt: dateMock,
  updatedAt: dateMock,
  username: 'username2',
  password: 'hash_password',
  posts: null,
};
