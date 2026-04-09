import crypto from 'node:crypto';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function transactionRoutes(app: FastifyInstance) {
  // List all transactions (session-scoped)
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest) => {
      const { sessionId } = request.cookies;

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select('*');

      return { transactions };
    },
  );

  // Get a single transaction by id (session-scoped)
  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const getTransactionByIdSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionByIdSchema.parse(request.params);
      const { sessionId } = request.cookies;

      const transaction = await knex('transactions')
        .where({ id, session_id: sessionId })
        .first();

      if (!transaction) {
        return reply.status(404).send({ message: 'Transaction not found' });
      }

      return { transaction };
    },
  );

  // Get account summary (session-scoped)
  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest) => {
      const { sessionId } = request.cookies;

      const summary = await knex('transactions')
        .where('session_id', sessionId)
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

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'income' ? amount : -amount,
      session_id: sessionId,
    });

    return reply.status(201).send({ message: 'Transaction created successfully' });
  });
}
