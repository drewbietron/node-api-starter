import sendgrid from "@sendgrid/mail";

import PasswordReset from "../../../src/lib/password-reset";
import Session from "../../../src/lib/session";
import { EEmailTemplates } from "../../../src/lib/email";

import createUser from "../../fabricators/user";

describe("PasswordReset", () => {
  function describedClass(email) {
    return new PasswordReset(email);
  }

  let user;
  beforeAll(async () => {
    user = await createUser();
  });

  describe("sendEmail", () => {
    beforeEach(() => {
      process.env.SENDGRID_API_KEY = "SG.123";
      spyOn(sendgrid, "send").and.returnValue(Promise.resolve({}));
    });

    it("finds a user by their email and emails them their token", async () => {
      const token = await new Session({ user }).generateToken();

      await describedClass(user.email).sendEmail();

      expect(sendgrid.send).toHaveBeenCalledWith({
        from: "Node API Starter<no-reply@node-api-starter.com>",
        subject: "Reset Your Password",
        templateId: EEmailTemplates.RESET_PASSWORD,
        personalizations: [
          {
            to: user.email,
            dynamic_template_data: {
              token,
            },
          },
        ],
      });
    });
  });

  describe("no user found", () => {
    it("returns a 404 with the not found error message", async () => {
      try {
        await describedClass("notfound@foo.com").sendEmail();
      } catch (e) {
        expect(e.message).toBe("No user found for notfound@foo.com");
      }
    });
  });

  describe("sendgrid error", () => {
    beforeEach(() => {
      spyOn(sendgrid, "send").and.throwError("Network down");
    });

    it("returns a 500 with the error message", async () => {
      try {
        await describedClass(user.email).sendEmail();
      } catch (e) {
        expect(e.message).toBe("Network down");
      }
    });
  });
});
