import serverless from 'serverless-http';
import { createServer } from '../../dist/server/production.mjs';

const app = createServer();
const handler = serverless(app);

export const api = async (event, context) => {
  return handler(event, context);
};
