class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    stack,
    errors = [],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    if (!stack) Error.captureStackTrace(this, this.constructor);
    else this.stack = stack;
  }
}

export default ApiError;
