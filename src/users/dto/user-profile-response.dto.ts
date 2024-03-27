import { UserDto } from './user.dto';

export class UserProfileResponse extends UserDto {
  constructor(partial: Partial<UserProfileResponse>) {
    super();
    Object.assign(this, partial);
  }
}
