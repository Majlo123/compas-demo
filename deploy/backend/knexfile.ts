import type { Knex } from 'knex';

// Use DATABASE_URL from env or fallback to individual env vars
const dbConfig: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 20,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/database/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/database/seeds',
    extension: 'ts',
  },
};

const knexConfig: { [key: string]: Knex.Config } = {
  development: dbConfig,
  staging: dbConfig,
  production: {
    ...dbConfig,
    pool: {
      min: 2,
      max: 30,
    },
  },
};

export default knexConfig;
