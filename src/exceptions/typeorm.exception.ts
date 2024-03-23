import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';
import { MESSAGE_ERROR } from 'src/utils/constants';

export class TypeOrmException extends HttpException {
  constructor(
    response: string | Record<string, any> = MESSAGE_ERROR.BAD_REQUEST,
    status: number = HttpStatus.BAD_REQUEST,
    options?: HttpExceptionOptions,
  ) {
    super(response, status, options);
  }
}
