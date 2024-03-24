import { UserDto } from 'src/users/dto/user.dto';

export type JwtPayload = { sub: UserDto['id'] };
