import { PickType } from '@nestjs/mapped-types';

import { UserDto } from 'src/users/dto/user.dto';

export class SignInDto extends PickType(UserDto, ['username', 'password']) {}
