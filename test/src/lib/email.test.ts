import sendgrid from "@sendgrid/mail";

import Email, { EEmailTemplates } from "../../../src/lib/email";

describe("Email", () => {
  const mailDataDefaults = {
    from: "Node API Starter<no-reply@node-api-starter.com>",
  };

  function describedClass(
    mailData = mailDataDefaults,
    template?: EEmailTemplates
  ) {
    return new Email({ ...mailData, ...mailDataDefaults }, template);
  }

  beforeEach(() => {
    process.env.SENDGRID_API_KEY = "SG.123";
    spyOn(sendgrid, "send").and.returnValue(Promise.resolve({}));
  });

  describe("send", () => {
    it("sends an email with the proper arguments", async () => {
      await describedClass()
        .send()
        .then(() => {
          expect(sendgrid.send).toHaveBeenCalledWith({
            ...mailDataDefaults,
            from: "Node API Starter<no-reply@node-api-starter.com>",
          });
        });
    });

    it("always sends as Node API Starter", async () => {
      await describedClass({ from: "yomomma.com" })
        .send()
        .then(() => {
          expect(sendgrid.send).toHaveBeenCalledWith({
            ...mailDataDefaults,
            from: "Node API Starter<no-reply@node-api-starter.com>",
          });
        });
    });
  });

  describe("with a template", () => {
    it("sends an email with the template", async () => {
      await describedClass(mailDataDefaults, EEmailTemplates.RESET_PASSWORD)
        .send()
        .then(() => {
          expect(sendgrid.send).toHaveBeenCalledWith({
            ...mailDataDefaults,
            templateId: EEmailTemplates.RESET_PASSWORD,
          });
        });
    });
  });
});
