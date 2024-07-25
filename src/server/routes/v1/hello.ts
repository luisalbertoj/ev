import { defineEventHandler } from 'h3';

export default defineEventHandler(async ({ context }) => {
  const { MY_KV } = context['cloudflare'].env;
  const greeting = (await MY_KV.get('greeting')) ?? 'hello';

  return {
    greeting,
  };
});
