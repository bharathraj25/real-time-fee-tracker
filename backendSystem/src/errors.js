class HttpError extends Error {
  constructor(code, message) {
    if (code == 400) message = "Bad Request - " + message;
    super(message);
    this.code = code;
  }
}

module.exports = { HttpError };
