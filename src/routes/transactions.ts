import crypto from 'node:crypto';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function transactionRoutes(app: FastifyInstance) {

  // List all transactions (Scoped to session)
  app.get('/',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest) => {
      const sessionId = request.cookies.sessionId;

      const transactions = await knex('transactions')
        .select('*')
        .where({ session_id: sessionId });

      return { transactions };
    });

  // Get a single transaction by id (Scoped to session)
  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {

      const sessionId = request.cookies.sessionId;
      const getTransactionByIdSchema = z.object({
        id: z.uuid(),
      });

      const { id } = getTransactionByIdSchema.parse(request.params);

      const transaction = await knex('transactions')
        .where({ id, session_id: sessionId })
        .first();

      if (!transaction) {
        return reply.status(404).send({ message: 'Transaction not found' });
      }

      return { transaction };
    },
  );

  // Get account summary (Scoped to session)
  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request: FastifyRequest) => {
      const sessionId = request.cookies.sessionId;

      const summary = await knex('transactions')
        .where({ session_id: sessionId })
        .sum('amount', { as: 'amount' })
        .first();

      return { summary };
    },
  );

  // Create a new transaction (Scoped to session)
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
        httpOnly: true
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
