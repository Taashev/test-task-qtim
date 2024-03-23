import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

import { TypeOrmException } from 'src/exceptions/typeorm.exception';
import { MESSAGE_ERROR } from 'src/utils/constants';

@Catch(TypeOrmException)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private message: string;
  private statusCode: number;

  catch(exception: TypeOrmException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const httpResponse = http.getResponse();

    this.statusCode = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    if (exceptionResponse instanceof QueryFailedError) {
      this.handlerQueryFailedError(exceptionResponse);
    } else {
      this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      this.message = MESSAGE_ERROR.INTERNAL_SERVER_ERROR;
    }

    httpResponse
      .status(this.statusCode)
      .json({ message: this.message, statusCode: this.statusCode });
  }

  private handlerQueryFailedError(exception: QueryFailedError<any>): void {
    const driverError = exception.driverError;

    if (driverError.code === '23505' && driverError.table === 'users') {
      this.statusCode = HttpStatus.CONFLICT;

      this.message =
        MESSAGE_ERROR.ALREADY_EXISTS_USER +
        `. Поле, вызвавшее конфликт: ${driverError.detail}`;
    } else {
      this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      this.message = MESSAGE_ERROR.INTERNAL_SERVER_ERROR;
    }
  }
}
