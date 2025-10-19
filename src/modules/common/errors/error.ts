import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }

  static BadRequest(message: string) {
    return new ApiException(message, HttpStatus.BAD_REQUEST);
  }

  static Unauthorized(message: string) {
    return new ApiException(message, HttpStatus.UNAUTHORIZED);
  }

  static Forbidden(message: string) {
    return new ApiException(message, HttpStatus.FORBIDDEN);
  }

  static NotFound(message: string) {
    return new ApiException(message, HttpStatus.NOT_FOUND);
  }

  static Conflict(message: string) {
    return new ApiException(message, HttpStatus.CONFLICT);
  }

  static UnprocessableEntity(message: string) {
    return new ApiException(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  static TooManyRequests(message: string) {
    return new ApiException(message, HttpStatus.TOO_MANY_REQUESTS);
  }

  static InternalError(message: string) {
    return new ApiException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
