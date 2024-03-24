import { PostDto } from './post.dto';

export class PostResponseDto extends PostDto {
  constructor(partial: Partial<PostResponseDto>) {
    super();
    Object.assign(this, partial);
  }
}
