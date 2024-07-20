import type { Attachment } from 'nodemailer/lib/mailer';

export interface EmailConfig {
  host: string;
  port: string;
  user: string;
  pass: string;
}
export interface MailPayload {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
  attachments: Attachment[];
}
export interface SendMailPayload {
  userId: string;
  companyId: string;
  registryId: string;
  to: string[];
  subject: string;
  content: string;
  attachments: [];
  file: File[];
}
