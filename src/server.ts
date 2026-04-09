import cookie from '@fastify/cookie'
import fastify, { type FastifyRequest } from 'fastify';
import { env } from './env';
import { transactionRoutes } from './routes/transactions';

const app = fastify();

app.addHook('preHandler', async (request: FastifyRequest) => {
  console.log(`[${request.method}] ${request.url}`);
});

app.register(cookie);

app.register(transactionRoutes, { prefix: '/transactions' });

app
  .listen({
    port: env.PORT,
  })
  .then((address) => {
    console.log(`Server listening at ${address}`);
  });
