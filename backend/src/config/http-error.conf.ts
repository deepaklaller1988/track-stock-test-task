class HttpError {
  code: String;
  statusCode: number;

  constructor(code: string, statusCode: number) {
    this.code = code;
    this.statusCode = statusCode;
  }
}

const ERRORS: { [key: string]: HttpError } = {
  /** VALIDATION */
  ERR_VALIDATION: new HttpError("ERR_VALIDATION", 400),
  /** INTERNAL SERVER ERROR */
  ERR_INTERNAL_SERVER_ERROR: new HttpError("ERR_INTERNAL_SERVER_ERROR", 500),
  /**
   * -- AUTH --
   */
  ERR_AUTH_WRONG_USERNAME_OR_PASSWORD: new HttpError(
    "ERR_AUTH_WRONG_USERNAME_OR_PASSWORD",
    403
  ),
  ERR_NOT_AUTHORIZED: new HttpError("ERR_NOT_AUTHORIZED", 403),
  ERR_AUTH_USERNAME_OR_EMAIL_ALREADY_EXIST: new HttpError(
    "ERR_AUTH_USERNAME_OR_EMAIL_ALREADY_EXIST",
    403
  ),
  
};

export default ERRORS;