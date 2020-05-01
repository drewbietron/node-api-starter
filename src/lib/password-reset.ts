import User from "../database/models/user";
import Session from "./session";
import Email, { EEmailTemplates } from "./email";

export default class PasswordReset {
  public email: string;

  constructor(email: string) {
    this.email = email;
  }

  public async sendEmail() {
    try {
      await new Email(
        {
          subject: "Reset Your Password",
          personalizations: [
            {
              to: this.email,
              dynamic_template_data: {
                token: await this.token(),
              },
            },
          ],
        },
        EEmailTemplates.RESET_PASSWORD
      ).send();

      return true;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(error.message);
      }

      throw new Error(error);
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

    throw new Error(`No user found for ${this.email}`);
  }
}
