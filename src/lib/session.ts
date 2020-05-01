import jwt from "jsonwebtoken";

import User from "../database/models/user";

interface ISessionOptions {
  user?: User;
  token?: string;
}

export default class Session {
  public options: ISessionOptions;

  constructor(options?: ISessionOptions) {
    this.options = options;
  }

  public async generateToken() {
    try {
      return jwt.sign(
        {
          data: this.options.user.uuid,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  public validateToken(): { data: string; iat: Date; exp: Date } | any {
    try {
      return jwt.verify(this.formattedToken, process.env.JWT_SECRET);
    } catch {
      return false;
    }
  }

  public async currentUser(uuid?) {
    const userUuid = uuid || this.validateToken().data;
    if (userUuid) {
      try {
        return await User.findByPk(userUuid, {
          attributes: {
            exclude: ["password"],
          },
        });
      } catch {
        return null;
      }
    }

    return null;
  }

  public get formattedToken() {
    if (this.options.token.startsWith("Bearer")) {
      return this.options.token.replace("Bearer", "").trim();
    }

    return this.options.token;
  }
}
