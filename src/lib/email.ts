import sendgrid from "@sendgrid/mail";
import { MailData, MailDataRequired } from "@sendgrid/helpers/classes/mail";

export enum EEmailTemplates {
  RESET_PASSWORD = "d-97887a882dc7480b83ead59d935e7b1f",
  WELCOME_EMAIL = "d-216b36a2ef584fc3a4441c76c997c0c7"
}

// There's a bug on the sendgrid TS types and `dynamicTemplateData`
// needs to be send up snake cased in order to be accepted by sendgrid.
export interface IMailData extends Partial<MailData> {
  personalizations?: [
    {
      to: string;
      // Instead of dynamicTemplateData
      dynamic_template_data?: { [key: string]: any };
    }
  ];
}

export default class Email {
  public mailData: IMailData;
  public template: EEmailTemplates;

  constructor(mailData: IMailData, template: EEmailTemplates) {
    this.mailData = mailData;
    this.template = template;

    this.setUpClient();
  }

  public setUpClient() {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  public send() {
    if (!process.env.SENDGRID_API_KEY) return null;

    return sendgrid.send(this.emailToSend);
  }

  private get templateId(): EEmailTemplates {
    return this.template;
  }

  private get emailToSend(): MailDataRequired {
    return {
      ...this.mailData,
      from: "Node API Starter<no-reply@node-api-starter.com>",
      templateId: this.templateId
    };
  }
}
