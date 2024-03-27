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
import { Exclude, Expose, Type } from 'class-transformer';

import { postConfig } from 'src/configs/post.config';
import { UserDto } from 'src/users/dto/user.dto';

const { title, description } = postConfig;

export class PostDto {
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
  @MinLength(title.minLength)
  @MaxLength(title.maxLength)
  title: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(description.minLength)
  @MaxLength(description.maxLength)
  description: string;

  @Expose()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserDto)
  owner: UserDto;

  @Exclude()
  @IsOptional()
  '_constructor-name_': string;
}
