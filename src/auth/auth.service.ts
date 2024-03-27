import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { MESSAGE_ERROR } from 'src/utils/constants';

import { SignInDto } from './dto/signin.dto';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  auth(userId: string) {
    const payload: JwtPayload = { sub: userId };

    const jwt = this.jwtService.sign(payload);

    const response = { access_token: jwt };

    return response;
  }

  async validateUser({ username, password }: SignInDto) {
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

    delete user.password;

    return user;
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const isValidPassword = await bcrypt.compare(password, userPassword);

    return isValidPassword;
  }
}
