import { Exclude } from 'class-transformer';

import { UserDto } from './user.dto';

export class UserProfileResponse extends UserDto {
  @Exclude()
  password: UserDto['password'];

  constructor(partial: Partial<UserProfileResponse>) {
    super();
    Object.assign(this, partial);
  }
}
