import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PartialType, PickType } from '@nestjs/mapped-types';

import { userConfig } from 'src/configs/user.config';

import { PostDto } from './post.dto';

const { username } = userConfig;

export class FilterPostsDto extends PartialType(PickType(PostDto, ['title'])) {
  @IsOptional()
  @IsString()
  @MinLength(username.minLength)
  @MaxLength(username.maxLength)
  author: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;
}
