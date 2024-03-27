import { Expose, Type } from 'class-transformer';
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

export class PostsFilterDto extends PartialType(PickType(PostDto, ['title'])) {
  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(username.minLength)
  @MaxLength(username.maxLength)
  author: string;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;
}
