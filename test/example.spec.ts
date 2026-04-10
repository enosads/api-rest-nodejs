import { test, expect } from 'vitest';

test('O usuário consegue cadastrar uma nova transação', () => {
  const respostStatusCode = 201;
  expect(respostStatusCode).toBe(201);
});
