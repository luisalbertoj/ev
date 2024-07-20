import { defineEventHandler, setResponseHeaders, H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  });
  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 200;
    event.node.res.statusMessage = 'No Content.';
    return 'OK';
  }
});
