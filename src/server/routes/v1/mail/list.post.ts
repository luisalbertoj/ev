import { APIService } from '../../../API.service';
import { defineEventHandler, readBody } from 'h3';
import { connect } from 'imap-simple';
import { simpleParser } from 'mailparser';

export default defineEventHandler(async (event) => {
  try {
    const api = new APIService();
    const body = await readBody(event);
    if (!body.userId || !body.companyId) {
      throw new Error('Missing userId or companyId');
    }

    const res = await api.EvolinciteMailConfigurationsByEvolinciteUserID(
      body.userId,
      undefined,
      {
        evolinciteCompanyID: {
          eq: body.companyId,
        },
      }
    );

    const mailConfig = res.items?.[0];
    if (!mailConfig || !mailConfig.email || !mailConfig.password) {
      throw new Error('Mail config not found');
    }

    const config = {
      imap: {
        user: mailConfig.email,
        password: mailConfig.password,
        host: 'imap.hostinger.com',
        port: 993,
        tls: true,
        authTimeout: 3000,
      },
    };

    const connection = await connect(config);

    const fetchEmails = async (boxName: string) => {
      await connection.openBox(boxName);
      const searchCriteria = ['ALL'];
      const fetchOptions = { bodies: ['HEADER', 'TEXT'], struct: true };

      const messages = await connection.search(searchCriteria, fetchOptions);

      const emails = await Promise.all(
        messages.map(async (message) => {
          const all = message.parts.find((part) => part.which === 'HEADER');
          const id = message.attributes.uid;
          const body = message.parts.find((part) => part.which === 'TEXT');

          const parsedMail = await simpleParser(body.body);

          return {
            id,
            subject: parsedMail.subject,
            from: parsedMail.from.text,
            text: parsedMail.text,
            date: parsedMail.date,
          };
        })
      );

      return emails;
    };

    const inbox = await fetchEmails('INBOX');
    const spam = await fetchEmails('SPAM'); // Ajusta este nombre si es diferente en tu servidor IMAP

    connection.end();

    return new Response(
      JSON.stringify({
        success: true,
        data: { inbox, spam },
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log({ e });
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Something went wrong: ' + JSON.stringify(e),
      }),
      {
        status: 500,
      }
    );
  }
});
