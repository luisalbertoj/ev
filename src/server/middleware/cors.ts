/* import { defineEventHandler, setResponseHeaders, H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
  const allowedOrigins = [
    'http://localhost:4200',
    'https://leads-up.evoluncite.com',
    'https://evoluncite.com',
  ];

  const origin = event.node.req.headers.origin || '';

  if (event.method === 'OPTIONS' || !event.method) {
    if (allowedOrigins.includes(origin)) {
      setResponseHeaders(event, {
        'Access-Control-Allow-Methods':
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      });
    } else {
      setResponseHeaders(event, {
        'Access-Control-Allow-Methods':
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      });
    }
    event.node.res.statusCode = 200;
    event.node.res.statusMessage = 'OK';
    return 'OK';
  }

  if (allowedOrigins.includes(origin)) {
    setResponseHeaders(event, {
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
  }
});
 */
