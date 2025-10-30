import type { Context } from '@netlify/functions';
import serverless from 'serverless-http';

let handler: any;

const getHandler = async () => {
  if (handler) return handler;

  try {
    // Dynamically import the server build
    const mod = await import('../../dist/server/production.mjs');
    const { createServer } = mod;
    const app = createServer();
    handler = serverless(app);
    return handler;
  } catch (error) {
    console.error('Failed to initialize handler:', error);
    throw error;
  }
};

export default async (event: any, context: Context) => {
  try {
    const handler = await getHandler();
    return await handler(event, context);
  } catch (error) {
    console.error('API handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
