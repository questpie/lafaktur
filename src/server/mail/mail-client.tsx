import "server-only";

import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import type SESTransport from "nodemailer/lib/ses-transport";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { Resend } from "resend";
import { env } from "~/env.mjs";

export type SendEmailOptions<TProps extends JSX.IntrinsicAttributes> = {
  from?: string;
  to: string;
  subject: string;

  component: React.ComponentType<TProps>;
  props: TProps;
};

export type SendMailResult =
  | { id: string; error?: never }
  | { id?: never; error: MailSendError };

class MailSendError extends Error {
  constructor(
    message: string,
    public readonly name = "MailSendError",
  ) {
    super(message);
  }
}

abstract class MailClient {
  abstract sendEmail<TProps extends JSX.IntrinsicAttributes>(
    opts: SendEmailOptions<TProps>,
  ): Promise<SendMailResult>;
}

//just a scoped cache
let mailClient: MailClient;

class SmtpMailClient extends MailClient {
  constructor(private readonly testTransport: nodemailer.Transporter) {
    super();
  }

  async sendEmail<TProps extends JSX.IntrinsicAttributes>(
    opts: SendEmailOptions<TProps>,
  ): Promise<SendMailResult> {
    const html = render(<opts.component {...opts.props} />);

    const result = (await this.testTransport.sendMail({
      from: opts.from ?? env.MAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html,
    })) as {
      err?: Error;
      info?: SMTPTransport.SentMessageInfo | SESTransport.SentMessageInfo;
    };

    if (!result.info || result.err) {
      return {
        error: new MailSendError(result.err?.message ?? "Unknown error"),
      };
    }

    if (env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug(
        "Preview URL: %s",
        nodemailer.getTestMessageUrl(result.info),
      );
    }

    return {
      id: result.info.messageId,
    };
  }
}

class ResendMailClient extends MailClient {
  constructor(private readonly resend: Resend) {
    super();
  }
  async sendEmail<TProps extends JSX.IntrinsicAttributes>(
    opts: SendEmailOptions<TProps>,
  ): Promise<SendMailResult> {
    const result = await this.resend.emails.send({
      from: opts.from ?? env.MAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      react: <opts.component {...opts.props} />,
    });

    if (!result.data || result.error) {
      return {
        error: new MailSendError(result.error?.message ?? "Unknown error"),
      };
    }

    return {
      id: result.data.id,
    };
  }
}

export async function getMailClient() {
  if (mailClient) {
    return Promise.resolve(mailClient);
  }

  if (process.env.NODE_ENV !== "production") {
    const testAccount = await nodemailer.createTestAccount();

    const testTransport = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    mailClient = new SmtpMailClient(testTransport);
    return mailClient;
  }

  const resend = new Resend(env.RESEND_KEY);
  mailClient = new ResendMailClient(resend);
  return mailClient;
}
