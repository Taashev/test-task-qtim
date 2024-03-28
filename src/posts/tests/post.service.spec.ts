import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { RedisPostsService } from 'src/redis/redis-posts.service';

import { PostsService } from '../posts.service';
import { CreatePostDto } from '../dto/create-post.dto';

import { PostsRepositoryProviderMock } from './mock/post.repository.mock';
import { owner1Mock } from './mock/owner.mock';
import {
  date2Mock,
  post1Mock,
  post2Mock,
  post3Mock,
  post7Mock,
  postsMock,
} from './mock/posts.mock';
import { UpdatePostDto } from '../dto/update-post.dto';

describe('PostsService', () => {
  let postsService: PostsService;

  beforeEach(async () => {
    const postsModuleRef = await Test.createTestingModule({
      providers: [
        PostsService,
        PostsRepositoryProviderMock,
        {
          provide: RedisPostsService,
          useValue: {
            set: async () => {},
            get: async () => {},
            del: async () => {},
            reset: async () => {},
          },
        },
      ],
    }).compile();

    postsService = await postsModuleRef.get(PostsService);
  });

  describe('Создание поста', () => {
    it('Пост создан успешно', async () => {
      const createPostDtoMock: CreatePostDto = {
        title: 'kek',
        description: 'pek',
      };

      const expectResult = {
        ...post1Mock,
        ...createPostDtoMock,
      };

      const createdPost = await postsService.create(
        createPostDtoMock,
        owner1Mock,
      );

      expect(createdPost).toEqual(expectResult);
    });
  });

  describe('Получение постов', () => {
    it('Успешно получили все посты', async () => {
      const posts = await postsService.findAll();

      expect(posts).toEqual(postsMock);
    });

    it('Пост по id успешно получен', async () => {
      const posts = await postsService.findOneById('1');

      const expectResult = postsMock[0];

      expect(posts).toEqual(expectResult);
    });

    it('Выбросить NotFoundException, если пост по id не найден', async () => {
      await expect(postsService.findOneById(undefined)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Тестирование фильтра постов', () => {
    it('Успешно получили выборку постов по пагинации с 1 позиции взять 2 поста', async () => {
      // ожидаем получить 2 поста начинаю со второго
      const expectResult = {
        posts: [post2Mock, post3Mock],
        count: postsMock.length,
      };

      // укажим в фильтре отступить 1 пост и получить 2
      const filterResult = await postsService.filterPosts({
        offset: 1,
        limit: 2,
      });

      expect(filterResult).toEqual(expectResult);
    });

    it('Успешно получили выборку постов по автору', async () => {
      // получим все посты автора с замоканого списка
      const postsAuthorByUsername = postsMock.filter(
        (post) => post.owner.username === 'username2',
      );

      // ожидаем что получим все посты автора
      // и счетчик общего количества постов автора
      const expectResult = {
        posts: postsAuthorByUsername,
        count: postsAuthorByUsername.length,
      };

      // укажим в фильтре чтобы вернул все посты нужного автора и их количество
      const filterResult = await postsService.filterPosts({
        offset: 0,
        limit: 0,
        author: 'username2',
      });

      expect(filterResult).toEqual(expectResult);
    });

    it('Успешно получили выборку постов по дате публикации', async () => {
      const postsByCreatedAt = postsMock.filter(
        (post) => post.createdAt === date2Mock,
      );

      const expectResult = {
        posts: postsByCreatedAt,
        count: postsByCreatedAt.length,
      };

      const filterResult = await postsService.filterPosts({
        offset: 0,
        limit: 0,
        createdAt: date2Mock,
      });

      expect(filterResult).toEqual(expectResult);
    });

    it('Успешно получили выборку постов по заголовку', async () => {
      const postsByTitle = postsMock.filter((post) =>
        post.title.includes('kek'),
      );

      const expectResult = {
        posts: postsByTitle,
        count: postsByTitle.length,
      };

      const filterResult = await postsService.filterPosts({
        offset: 0,
        limit: 0,
        title: 'kek',
      });

      expect(filterResult).toEqual(expectResult);
    });

    it('Успешно получили выборку по всем параметрам филтра', async () => {
      const expectResult = {
        posts: [post7Mock],
        count: 2,
      };

      const filterResult = await postsService.filterPosts({
        offset: 1,
        limit: 1,
        author: 'username2',
        createdAt: date2Mock,
        title: 'kek',
      });

      expect(filterResult).toEqual(expectResult);
    });
  });

  describe('Обновление постов', () => {
    it('Пост успешно обновлен', async () => {
      const updatePostDtoMock: UpdatePostDto = {
        title: 'update title',
        description: 'updated description',
      };

      const expectResult = {
        ...post1Mock,
        ...updatePostDtoMock,
      };

      const updatedPost = await postsService.update('', updatePostDtoMock);

      expect(updatedPost).toEqual(expectResult);
    });
  });

  describe('Удаление постов', () => {
    it('Пост успешно удален', async () => {
      const expectResult = { raw: [], affected: 1 };

      const deleteResult = await postsService.delete('1');

      expect(deleteResult).toEqual(expectResult);
    });

    it('Выбросили BadRequestException, если не удалось удалить пост', async () => {
      await expect(postsService.delete(undefined)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
