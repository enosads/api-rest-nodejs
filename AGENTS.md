# AGENTS.md

Instruções para agentes de IA (Claude, Copilot, etc.) que trabalham neste repositório.

## Visão Geral

API REST de estudo para gerenciamento de transações financeiras, desenvolvida durante o curso da Rocketseat. Construída com **Node.js**, **Fastify**, **Knex** e **SQLite**.

## Estrutura do Projeto

```
src/
├── @types/
│   └── knex.d.ts              # Tipagem das tabelas do banco de dados
├── env/
│   └── index.ts               # Validação das variáveis de ambiente com Zod
├── middlewares/
│   └── check-session-id-exists.ts  # Middleware de autenticação por cookie
├── routes/
│   └── transactions.ts        # Rotas do recurso de transações
├── database.ts                # Configuração do Knex + SQLite
└── server.ts                  # Entrada da aplicação Fastify
db/
└── migrations/                # Migrations do banco de dados
```

## Convenções de Código

- **Linguagem:** TypeScript (strict mode)
- **Runtime:** Node.js com ESM (`"type": "module"`)
- **Linter/Formatter:** Biome — rode `npm run lint` e `npm run format` antes de commitar
- **Estilo:** aspas simples, trailing commas, indentação 2 espaços
- **Imports:** sempre use imports explícitos; organize com o Biome (`organizeImports: on`)

## Commits

Use **Conventional Commits**:

| Prefixo    | Quando usar                                  |
| ---------- | -------------------------------------------- |
| `feat:`    | Nova funcionalidade                          |
| `fix:`     | Correção de bug                              |
| `docs:`    | Alterações em documentação                   |
| `chore:`   | Tarefas de configuração e manutenção         |
| `refactor:`| Refatoração sem mudança de comportamento     |
| `test:`    | Adição ou alteração de testes                |

Exemplo:
```
feat: add summary route to transactions
```

## Banco de Dados

- Cliente: **SQLite3** (arquivo `./db/app.db`, ignorado no git)
- Query Builder: **Knex**
- Para rodar migrations: `npm run knex -- migrate:latest`
- Para criar nova migration: `npm run knex -- migrate:make <nome>`

## Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

```env
DATABASE_URL="./db/app.db"
PORT=3333
NODE_ENV=development
```

## Autenticação

A identificação do usuário é feita via **cookie `sessionId`**:
- Criado automaticamente no primeiro `POST /transactions`
- Expira em 7 dias
- Todas as rotas de leitura exigem o cookie (middleware `checkSessionIdExists`)

## Endpoints

| Método | Rota                      | Descrição                          | Auth |
| ------ | ------------------------- | ---------------------------------- | ---- |
| POST   | `/transactions`           | Cria uma nova transação            | ❌   |
| GET    | `/transactions`           | Lista todas as transações do usuário | ✅ |
| GET    | `/transactions/:id`       | Busca uma transação pelo ID        | ✅   |
| GET    | `/transactions/summary`   | Retorna o saldo total do usuário   | ✅   |

## Comandos Úteis

```bash
npm run dev       # Inicia servidor em modo desenvolvimento
npm run build     # Compila TypeScript
npm run lint      # Verifica erros de lint
npm run format    # Formata o código
npm run knex -- migrate:latest   # Executa migrations
```
