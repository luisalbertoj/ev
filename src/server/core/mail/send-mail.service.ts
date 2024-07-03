import { createTransport } from 'nodemailer';
import type { EmailConfig, MailPayload } from './transport';

export const sendMail = async (
  { host, port, user, pass }: EmailConfig,
  { from, to, subject, html, text, attachments }: MailPayload,
) => {
  try {
    const client = createTransport({
      host,
      port: parseInt(port) ?? 465,
      secure: parseInt(port) === 465,
      auth: {
        user: user,
        pass: pass,
      },
    });

    const result = await client.sendMail({
      from,
      to: to.join(','),
      subject,
      html,
      attachments,
    });
    console.log(result);
    return {
      success: true,
      message: 'Correo enviado',
      result: result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Error al enviar el correo electrónico',
      error: JSON.stringify(error),
    };
  }
};
