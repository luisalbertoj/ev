/* import { H3Event, defineEventHandler, readBody } from 'h3';
import { createTransport } from 'nodemailer';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    console.log(body);
    const result = await testConnection({
      host: body.host,
      port: body.port,
      user: body.user,
      pass: body.pass,
    });
    return new Response(
      JSON.stringify({
        result,
        body: result.success ? 'ok' : body,
      }),
      {
        status: result.success ? 200 : 400,
      }
    );
  } catch (error) {
    console.log({ error });
    return new Response(
      JSON.stringify({
        error,
      }),
      {
        status: 400,
      }
    );
  }
});
const testConnection = async ({
  host,
  port,
  user,
  pass,
}: {
  host: string;
  port: string;
  user: string;
  pass: string;
}) => {
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
      from: user,
      to: user,
      subject: 'Test connection',
      text: 'test connection',
      html: '<p>...</p>',
    });
    console.log(result);
    return {
      success: true,
      message: 'Correo de prueba enviado correctamente',
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
 */
