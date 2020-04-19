import sendgrid from "@sendgrid/mail";
import { Request } from "jest-express/lib/request";
import { Response } from "jest-express/lib/response";

import PasswordReset from "../../../src/lib/password-reset";
import Session from "../../../src/lib/session";
import { EEmailTemplates } from "../../../src/lib/email";

import createUser from "../../fabricators/user";

describe("PasswordReset", () => {
  function mockResponse(): any {
    return new Response();
  }

  function mockRequest(formBody?): any {
    const req = new Request("/");
    req.setBody(formBody);

    return req;
  }

  function describedClass(req = mockRequest(), res = mockResponse()) {
    return new PasswordReset({
      req,
      res
    });
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

      await describedClass(mockRequest({ email: user.email }))
        .sendEmail()
        .then(() => {
          expect(sendgrid.send).toHaveBeenCalledWith({
            from: "Node API Starter<no-reply@node-api-starter.com>",
            subject: "Reset Your Password",
            templateId: EEmailTemplates.RESET_PASSWORD,
            personalizations: [
              {
                to: user.email,
                dynamic_template_data: {
                  token
                }
              }
            ]
          });
        });
    });

    it("returns a 201 when successful", async () => {
      const res = mockResponse();

      await describedClass(mockRequest({ email: user.email }), res)
        .sendEmail()
        .then(() => {
          expect(res.status).toHaveBeenCalledWith(201);
        });
    });
  });

  describe("no user found", () => {
    it("returns a 404 with the not found error message", async () => {
      const res = mockResponse();
      await describedClass(mockRequest({ email: "notfound@notfound.com" }), res)
        .sendEmail()
        .then(() => {
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith(
            "No user found for notfound@notfound.com"
          );
        });
    });
  });

  describe("sendgrid error", () => {
    beforeEach(() => {
      spyOn(sendgrid, "send").and.throwError("Network down");
    });

    it("returns a 500 with the error message", async () => {
      expect.assertions(2);

      const res = mockResponse();

      await describedClass(mockRequest({ email: user.email }), res)
        .sendEmail()
        .then(() => {
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith(new Error("Network down"));
        });
    });
  });
});
