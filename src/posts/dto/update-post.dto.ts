import { OmitType, PartialType } from '@nestjs/mapped-types';
import { PostDto } from './post.dto';

export class UpdatePostDto extends PartialType(
  OmitType(PostDto, [
    'id',
    'owner',
    'createdAt',
    'updatedAt',
    '_constructor-name_',
  ]),
) {}
