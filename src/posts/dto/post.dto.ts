import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { postConfig } from 'src/configs/post.config';
import { UserDto } from 'src/users/dto/user.dto';

const { title, description } = postConfig;

export class PostDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(title.minLength)
  @MaxLength(title.maxLength)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(description.minLength)
  @MaxLength(description.maxLength)
  description: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserDto)
  owner: UserDto;
}
