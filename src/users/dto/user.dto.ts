import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { userConfig } from 'src/configs/user.config';
import { PostDto } from 'src/posts/dto/post.dto';

const { username, password } = userConfig;

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(username.minLength)
  @MaxLength(username.maxLength)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(password.minLength)
  @MaxLength(password.maxLength)
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PostDto)
  posts: PostDto[];
}
