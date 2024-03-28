import { PostEntity } from 'src/posts/entities/post.entity';
import { owner1Mock, owner2Mock } from './owner.mock';

export const dateMock = new Date('2024-03-27');
export const date2Mock = new Date('2024-03-28');

export const post1Mock: PostEntity = {
  id: '1',
  createdAt: dateMock,
  updatedAt: dateMock,
  title: 'bmw 5',
  description: 'description',
  owner: owner1Mock,
};

export const post2Mock: PostEntity = {
  id: '2',
  createdAt: dateMock,
  updatedAt: dateMock,
  title: 'iphone 15',
  description: 'description',
  owner: owner2Mock,
};

export const post3Mock: PostEntity = {
  id: '3',
  createdAt: dateMock,
  updatedAt: dateMock,
  title: 'apply technology',
  description: 'description',
  owner: owner2Mock,
};

export const post4Mock: PostEntity = {
  id: '4',
  createdAt: date2Mock,
  updatedAt: dateMock,
  title: 'nodejs',
  description: 'description',
  owner: owner1Mock,
};

export const post5Mock: PostEntity = {
  id: '5',
  createdAt: date2Mock,
  updatedAt: dateMock,
  title: 'keka',
  description: 'description',
  owner: owner2Mock,
};

export const post6Mock: PostEntity = {
  id: '6',
  createdAt: date2Mock,
  updatedAt: dateMock,
  title: 'keka peka',
  description: 'description',
  owner: owner1Mock,
};

export const post7Mock: PostEntity = {
  id: '5',
  createdAt: date2Mock,
  updatedAt: dateMock,
  title: 'pekek',
  description: 'description',
  owner: owner2Mock,
};

export const postsMock: PostEntity[] = [
  post1Mock,
  post2Mock,
  post3Mock,
  post4Mock,
  post5Mock,
  post6Mock,
  post7Mock,
];
