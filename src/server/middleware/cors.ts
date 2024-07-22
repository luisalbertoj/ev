import { defineEventHandler, setResponseHeaders, H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
  // Define los dominios permitidos
  const allowedOrigins = [
    'http://localhost:4200',
    'https://leads-up.evoluncite.com',
    'https://evoluncite.com',
  ];

  // Obtén el origen de la solicitud
  const origin = event.node.req.headers.origin || '';

  // Verifica si el origen está en la lista de dominios permitidos
  if (allowedOrigins.includes(origin)) {
    setResponseHeaders(event, {
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
  }

  // Manejar solicitudes OPTIONS
  if (event.method === 'OPTIONS' || !event.method) {
    setResponseHeaders(event, {
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // Cachear la respuesta por un día (opcional)
    });
    event.node.res.statusCode = 200;
    event.node.res.statusMessage = 'OK';
    return 'OK';
  }
});
