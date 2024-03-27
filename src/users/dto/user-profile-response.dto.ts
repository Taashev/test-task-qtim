import { Exclude } from 'class-transformer';

import { UserDto } from './user.dto';

export class UserProfileResponseDto extends UserDto {
  @Exclude()
  password: UserDto['password'];

  constructor(partial: Partial<UserProfileResponseDto>) {
    super();
    Object.assign(this, partial);
  }
}
