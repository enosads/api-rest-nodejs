import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

app.get('/hello', async () => {

  const transactions = await knex('transactions').select('*').where({ amount: 100 });
  return transactions;
});
app
  .listen({
    port: 3333,
  })
  .then((address) => {
    console.log(`Server listening at ${address}`);
  });
