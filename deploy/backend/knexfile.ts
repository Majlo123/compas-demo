import type { Knex } from 'knex';
import config from './src/config/config';

// Parse DATABASE_URL or use individual env vars
const dbConfig: Knex.Config = {
  client: 'pg',
  connection: config.database.url || {
    host: process.env.DB_HOST || 'database',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'vacationtracker',
    user: process.env.DB_USER || 'vt_user',
    password: process.env.DB_PASSWORD || 'vt_password',
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
