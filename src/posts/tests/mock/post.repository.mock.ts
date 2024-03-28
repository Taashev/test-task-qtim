import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PostEntity } from 'src/posts/entities/post.entity';
import { PostsRepository } from 'src/posts/posts.repository';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { OptionsFilterDto } from 'src/posts/dto/options-filter.dto';

import { post1Mock, postsMock } from './posts.mock';

export const postsRepositoryMock: Partial<PostsRepository> = {
  create: jest
    .fn()
    .mockImplementation(
      (createPostDto: CreatePostDto) => createPostDto as PostEntity,
    ),

  save: jest.fn().mockImplementation(async (createPost: PostEntity) => {
    const post = {
      ...post1Mock,
      ...createPost,
    };

    return post;
  }),

  findAll: jest.fn().mockImplementation(() => postsMock),

  findOneById: jest
    .fn()
    .mockImplementation((postId: string) =>
      postsMock.find((post) => post.id === postId),
    ),

  update: jest
    .fn()
    .mockImplementation((postId: string, updatePostDto: UpdatePostDto) => {
      const updatedPost = { ...post1Mock, ...updatePostDto };

      return updatedPost;
    }),

  delete: jest.fn().mockImplementation((postId: string) => {
    const deleteResult = { raw: [], affected: 0 };

    const deletedPosts = postsMock.filter((post) => post.id === postId);

    deleteResult.affected = deletedPosts.length;

    return deleteResult;
  }),

  filterPosts: jest
    .fn()
    .mockImplementation((optionsFilter: OptionsFilterDto) => {
      // параметры фильтра
      const { offset, limit, author, createdAt, title } = optionsFilter;

      // изначально отдаются все посты и их количество
      const result = { posts: postsMock, count: postsMock.length };

      // фильтр по автору
      if (author) {
        const postsAuthorByUsername = result.posts.filter(
          (post) => post.owner.username === author,
        );

        result.posts = postsAuthorByUsername;
        result.count = postsAuthorByUsername.length;
      }

      // фильтр по дате публикации
      if (createdAt) {
        const postsByCreatedAt = result.posts.filter(
          (post) => post.createdAt === createdAt,
        );

        result.posts = postsByCreatedAt;
        result.count = postsByCreatedAt.length;
      }

      // фильтр по заголовку
      if (title) {
        const postsByTitle = result.posts.filter((post) =>
          post.title.includes('kek'),
        );

        result.posts = postsByTitle;
        result.count = postsByTitle.length;
      }

      // фильтр сколько отступить
      if (offset) {
        const postsByOffset = result.posts.slice(offset);

        result.posts = postsByOffset;
      }

      // фильтр сколько взять
      if (limit) {
        const postsByOffset = result.posts.slice(0, limit);

        result.posts = postsByOffset;
      }

      return result;
    }),
};

export const PostsRepositoryProviderMock = {
  provide: PostsRepository,
  useValue: postsRepositoryMock,
};
