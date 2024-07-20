import { H3Event, defineEventHandler, readBody } from 'h3';
const Imap = require('imap');
import { simpleParser } from 'mailparser';
import { APIService } from '../../../API.service';

export default defineEventHandler(async (event: H3Event) => {
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
    var imap = new Imap({
      user: mailConfig.email,
      password: mailConfig.password,
      host: 'imap.hostinger.com',
      port: 993,
      tls: true,
    });
    const mails = await new Promise((resolve, reject) => {
      imap.once('ready', function () {
        imap.openBox('INBOX', true, function (err: any, _box: any) {
          if (err) throw err;
          imap.search(['ALL'], function (err: any, results: any) {
            if (err) throw err;
            const f = imap.fetch(results, { bodies: '' });
            const emails: any = [];

            f.on('message', function (msg: any, seqno: any) {
              const prefix = '(#' + seqno + ') ';
              msg.on('body', function (stream: any, info: any) {
                simpleParser(stream, (err, mail) => {
                  if (err) reject(err);
                  emails.push({
                    ...mail,
                    id: mail.messageId,
                    subjectText: mail.subject,
                    fromText: mail?.from?.text,
                    textText: mail.text,
                  });
                });
              });
            });

            f.once('error', function (err: any) {
              reject(err);
            });

            f.once('end', function () {
              imap.end();
              resolve(emails);
            });
          });
        });
      });

      imap.once('error', function (err: any) {
        reject(err);
      });

      imap.once('end', function () {
        console.log('Connection ended');
      });

      imap.connect();
    }).catch((e) => {
      throw new Error(e);
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: mails,
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
        message: 'Something went wrong' + JSON.stringify(e),
      }),
      {
        status: 500,
      }
    );
  }
});
