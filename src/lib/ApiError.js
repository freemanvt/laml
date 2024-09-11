class ApiError extends Error {
  constructor(httpStatusCode, message) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.message = message;
  }

  toJson = () => ({
    httpStatusCode: this.httpStatusCode,
    message: this.message
  });
}

module.exports = ApiError;