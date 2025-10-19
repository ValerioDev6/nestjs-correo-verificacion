import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  path: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    const mailerService = this.configService.get<string>('MAILER_SERVICE');
    const mailerEmail = this.configService.get<string>('MAILER_EMAIL');
    const mailerPassword = this.configService.get<string>('MAILER_PASSWORD');

    if (!mailerService || !mailerEmail || !mailerPassword) {
      throw new Error('❌ Missing email configuration. Please check your environment variables.');
    }

    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: mailerPassword,
      },
    });

    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('✅ Email service connection established successfully');
    } catch (error) {
      this.logger.error('❌ Failed to establish email service connection:', error);
      throw error;
    }
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      const mailOptions = {
        from: this.configService.get<string>('MAILER_EMAIL'),
        to,
        subject,
        html: htmlBody,
        attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`📩 Email sent successfully to ${to}. MessageId: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${to}:`, error);
      return false;
    }
  }
}
