import { Request, Response, NextFunction } from "express";
import Session from "./session";

interface IAuthenticationOptions {
  req: Request;
  res: Response;
  next: NextFunction;
}

export const authenticatedPaths = ["/authenticated"];

export default class Authentication {
  public req: Request;
  public res: Response;
  public next: NextFunction;

  constructor(options: IAuthenticationOptions) {
    this.req = options.req;
    this.res = options.res;
    this.next = options.next;
  }

  public authenticate() {
    return this.handleReturn();
    const session = new Session({ token: this.req.headers.authorization });
    // Set res.locals to the current session so that the controllers
    // have access to the current user via `res.locals.session`
    this.res.locals.session = session;

    if (this.authencatedPath(this.req.path)) {
      if (session.validateToken()) {
        return this.handleReturn();
      }

      return this.res.status(401).json();
    }

    // Not an authorized path, carry on
    return this.handleReturn();
  }

  private authencatedPath(path: string) {
    return authenticatedPaths.some(authPath => {
      return path.startsWith(authPath);
    });
  }

  private handleReturn() {
    return this.next();
  }
}
