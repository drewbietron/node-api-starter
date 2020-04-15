export default class NotFoundError extends Error {
  public status: number;
  public name: string;

  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, NotFoundError);

    this.name = "NotFoundError";
    this.status = 404;
  }
}
