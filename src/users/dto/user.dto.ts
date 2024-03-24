import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  password: string;
}
