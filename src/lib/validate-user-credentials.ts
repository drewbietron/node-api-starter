import bcrypt from "bcrypt";

import { IUser } from "../database/models/user";

export default class ValidateUserCredentials {
  public password: string;
  public user: IUser;

  constructor(user: IUser, password: string) {
    this.password = password;
    this.user = user;
  }

  public async passwordIsValid() {
    try {
      return bcrypt.compare(this.password, this.user.password);
    } catch (error) {
      throw new Error(error);
    }
  }
}
