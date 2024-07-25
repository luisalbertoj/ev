/* import { getUrl } from 'aws-amplify/storage';
import { H3Event, defineEventHandler, readBody } from 'h3';
import type { Attachment } from 'nodemailer/lib/mailer';
import {
  APIService,
  EvolinciteMailStates,
  UpdateEvolinciteMailInput,
} from '../../../API.service';
import { sendMail } from '../../../core/mail/send-mail.service';

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  let inputUpdateMails: UpdateEvolinciteMailInput = {
    id: body.registryId,
  };
  const client = new APIService();
  try {
    const res = await client.EvolinciteMailConfigurationsByEvolinciteUserID(
      body.userId,
      undefined,
      {
        evolinciteCompanyID: {
          eq: body.companyId,
        },
      }
    );
    const mailConfig = res.items?.[0];
    if (!mailConfig) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Mail config not found',
        }),
        {
          status: 500,
        }
      );
    }
    const files = await getDocuments(body.attachments);

    const attachments = files.map((file): Attachment => {
      return {
        filename: file.name,
        path: file.url,
      };
    });

    const result = await sendMail(
      {
        host: mailConfig.SMTP ?? '',
        port: '465',
        user: mailConfig.email ?? '',
        pass: mailConfig.password ?? '',
      },
      {
        from: mailConfig.email ?? '',
        to: body.to ?? [],
        subject: body.subject ?? '',
        html: body.content ?? '',
        text: body.content ?? '',
        attachments: attachments ?? [],
      }
    );
    if (!result) {
      inputUpdateMails.response = JSON.stringify(result);
      throw new Error('Error al enviar el correo');
    }
    inputUpdateMails.response = JSON.stringify(result);
    inputUpdateMails.submissionStatus = EvolinciteMailStates.SENT;
    const resUpdate = await client.UpdateEvolinciteMail(inputUpdateMails);

    return new Response(
      JSON.stringify({
        result,
        body,
        resUpdate,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log({ error });
    inputUpdateMails.submissionStatus = EvolinciteMailStates.REJECTED;
    const resUpdate = await client.UpdateEvolinciteMail(inputUpdateMails);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al enviar el correo',
        error,
      }),
      {
        status: 500,
      }
    );
  }
});

async function getDocuments(
  keys: string[]
): Promise<{ name: string; url: string }[]> {
  const rest: { name: string; url: string }[] = [];
  if (!keys) return rest;
  for (const key of keys) {
    const res = await getUrl({
      key,
      options: {
        expiresIn: 3600,
      },
    });
    const urlResource = res.url.href;

    const documentName = key.split('/').pop() as string;
    const extension = documentName.split('.').pop();
    const name = `${
      documentName + new Date().toLocaleDateString()
    }.${extension}`;

    rest.push({ name, url: urlResource });
  }
  return rest;
}
 */
