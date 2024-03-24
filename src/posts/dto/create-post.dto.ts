import { OmitType } from '@nestjs/mapped-types';
import { PostDto } from './post.dto';

export class CreatePostDto extends OmitType(PostDto, ['id', 'owner']) {}
