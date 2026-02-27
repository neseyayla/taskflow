export interface ErrorDetails {
  [key: string]: unknown;
}

export class CustomError extends Error {
  public readonly statusCode: number;

  public readonly details?: ErrorDetails;

  constructor(message: string, statusCode = 500, details?: ErrorDetails) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

