import knex, { Knex } from 'knex';
import knexConfig from '../../knexfile';
import logger from '../config/logger';

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

// Create Knex instance for migrations
const db: Knex = knex(config);

/**
 * Run all pending migrations
 */
export const runMigrations = async (): Promise<void> => {
  try {
    logger.info('Running database migrations...');
    const [batchNo, migrations] = await db.migrate.latest();

    if (migrations.length === 0) {
      logger.info('Database is up to date. No migrations were run.');
    } else {
      logger.info(`Batch ${batchNo} run: ${migrations.length} migrations`);
      migrations.forEach((migration: string) => {
        logger.info(`  ✓ ${migration}`);
      });
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
};

/**
 * Rollback the last batch of migrations
 */
export const rollbackMigrations = async (): Promise<void> => {
  try {
    logger.info('Rolling back migrations...');
    const [batchNo, migrations] = await db.migrate.rollback();

    if (migrations.length === 0) {
      logger.info('No migrations to rollback.');
    } else {
      logger.info(`Batch ${batchNo} rolled back: ${migrations.length} migrations`);
      migrations.forEach((migration: string) => {
        logger.info(`  ✓ ${migration}`);
      });
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
};

/**
 * Run seed files (only in development)
 */
export const runSeeds = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    logger.warn('Seeds are disabled in production environment.');
    return;
  }

  try {
    logger.info('Running database seeds...');
    await db.seed.run();
    logger.info('Seeds completed successfully.');
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
};

/**
 * Get migration status
 */
export const getMigrationStatus = async (): Promise<void> => {
  try {
    const [completed, pending] = await db.migrate.list();

    logger.info('Completed migrations:');
    completed.forEach((migration: string) => {
      logger.info(`  ✓ ${migration}`);
    });

    logger.info('Pending migrations:');
    pending.forEach((migration: { name: string }) => {
      logger.info(`  ○ ${migration.name}`);
    });
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
};

export default db;
