import crypto from 'node:crypto';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';

export async function transactionRoutes(app: FastifyInstance) {

  // List all transactions
  app.get('/', async () => {

    const transactions = await knex('transactions')
      .select('*');

    return { transactions };
  });

  // Get a single transaction by id
  app.get(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const getTransactionByIdSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionByIdSchema.parse(request.params);

      const transaction = await knex('transactions')
        .where({ id })
        .first();

      if (!transaction) {
        return reply.status(404).send({ message: 'Transaction not found' });
      }

      return { transaction };
    },
  );

  // Get account summary
  app.get(
    '/summary',
    async () => {
      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .first();

      return { summary };
    },
  );

  // Create a new transaction
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['income', 'expense']),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    );

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'income' ? amount : -amount,
    });

    return reply.status(201).send({ message: 'Transaction created successfully' });
  });
}
