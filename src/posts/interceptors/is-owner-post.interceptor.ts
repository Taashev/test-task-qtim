import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { MESSAGE_ERROR } from 'src/utils/constants';

import { PostsService } from '../posts.service';

@Injectable()
export class IsOwnerPostInterceptor implements NestInterceptor {
  constructor(private readonly postsService: PostsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const http = context.switchToHttp();
    const req = http.getRequest() as Request;

    const userRequest = req.user;

    const postId = req.params['id'];
    const post = await this.postsService.findOneById(postId, {
      relations: { owner: true },
    });

    if (!post) {
      throw new NotFoundException(MESSAGE_ERROR.NOT_FOUND_POST);
    }

    const postOwnerId = post.owner.id;

    if (postOwnerId !== userRequest.id) {
      throw new ForbiddenException(MESSAGE_ERROR.FORBIDDEN_POST);
    }

    return next.handle();
  }
}
