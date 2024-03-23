import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { MESSAGE_ERROR } from 'src/utils/constants';

import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async auth({ username, password }: SignInDto) {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new UnauthorizedException(MESSAGE_ERROR.AUTH_USER);
    }

    const isValidPassword = await this.validatePassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException(MESSAGE_ERROR.AUTH_USER);
    }

    const payload = { id: user.id };

    const jwt = await this.jwtService.signAsync(payload);

    const response = { access_token: jwt };

    return response;
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const isValidPassword = await bcrypt.compare(password, userPassword);

    return isValidPassword;
  }
}
