export class BaseError {
  public message : string;
  public code : string;

  constructor(message : string, code : string) {
    this.message = message;
    this.code = code;
  }
}