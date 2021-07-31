import { BaseError } from "./BaseError";

export class LogicError extends BaseError {
  public data : unknown;

  constructor(message : string, code : string, data : unknown) {
    super(message, code);

    this.data = data;
  }
}