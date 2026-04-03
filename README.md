# API REST Node.js

API REST para gerenciamento de transações financeiras, construída com **Fastify**, **Knex** e **SQLite**.

## Tecnologias

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://fastify.dev/)
- [Knex](https://knexjs.org/) (Query Builder)
- [SQLite3](https://www.sqlite.org/)
- [Biome](https://biomejs.dev/) (Linter & Formatter)

## Pré-requisitos

- Node.js >= 18
- npm

## Instalação

```bash
# Clone o repositório
git clone https://github.com/enosads/api-rest-nodejs.git

# Acesse a pasta do projeto
cd api-rest-nodejs

# Instale as dependências
npm install
```

## Configuração do banco de dados

```bash
# Executar migrations
npm run knex -- migrate:latest
```

## Uso

```bash
# Iniciar servidor em modo desenvolvimento
npm run dev
```

O servidor será iniciado em `http://localhost:3333`.

## Scripts disponíveis

| Script         | Descrição                          |
| -------------- | ---------------------------------- |
| `npm run dev`  | Inicia o servidor em modo dev      |
| `npm run build`| Compila o projeto TypeScript       |
| `npm run lint` | Executa o linter (Biome)           |
| `npm run format`| Formata o código (Biome)          |
| `npm run knex` | Executa comandos do Knex CLI       |

## Estrutura do banco de dados

### Tabela `transactions`

| Coluna       | Tipo      | Descrição                    |
| ------------ | --------- | ---------------------------- |
| id           | UUID      | Identificador único (PK)    |
| session_id   | UUID      | ID da sessão do usuário      |
| title        | TEXT      | Título da transação          |
| amount       | DECIMAL   | Valor da transação           |
| created_at   | TIMESTAMP | Data de criação              |

## Licença

ISC
