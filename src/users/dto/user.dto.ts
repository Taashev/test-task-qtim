import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDate,
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
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @Expose()
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  @Expose()
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

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => PostDto)
  posts: PostDto[];

  @Exclude()
  @IsOptional()
  '_constructor-name_': string;
}
