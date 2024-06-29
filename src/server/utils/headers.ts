export const getHeaders = (origin?: string | null) => {
  if (
    origin === 'http://localhost:4200' ||
    origin === 'https://evoluncite.com' ||
    origin === 'https://leads-up.evoluncite.com' ||
    origin === 'https://leads-up.evoluncite.com'
  ) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    };
  }

  return {
    'Content-Type': 'application/json',
  };
};
