import { Request, Response } from "express";
import User from "../database/models/user";
import Session from "./session";
import Email, { EEmailTemplates } from "./email";
import NotFoundError from "./errors";

interface IPasswordResetOptions {
  req: Request;
  res: Response;
}

export default class PasswordReset {
  get email() {
    return this.options.req.body.email;
  }

  public options: IPasswordResetOptions;

  constructor(options: IPasswordResetOptions) {
    this.options = options;
  }

  public async sendEmail() {
    try {
      const token = await this.token();
      await new Email(
        {
          subject: "Reset Your Password",
          personalizations: [
            {
              to: this.email,
              dynamic_template_data: {
                token
              }
            }
          ]
        },
        EEmailTemplates.RESET_PASSWORD
      ).send();

      return this.options.res.status(201).json();
    } catch (error) {
      if (error.status === 404) {
        return this.options.res.status(404).json(error.message);
      }

      return this.options.res.status(500).json(error);
    }
  }

  private async token() {
    const user = await this.user();
    return new Session({ user }).generateToken();
  }

  private async user() {
    const user = await User.findOne({ where: { email: this.email } });

    if (user) {
      return user;
    }

    throw new NotFoundError(`No user found for ${this.email}`);
  }
}
