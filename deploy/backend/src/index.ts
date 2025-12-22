import app from 'app';
import config from 'config/config';
import logger from 'config/logger';
import { runMigrations, runSeeds } from 'database';
import { createServer } from 'http';

let server: any;

const exitHandler = (): void => {
  if (server) {
    server.close(() => {
      logger.warn('Server closed');
      process.exit(1);
    });
  } else {
    logger.warn('Server not started');
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any): void => {
  logger.error(error);
  exitHandler();
};

const initializeDatabase = async (): Promise<void> => {
  try {
    // Run pending migrations
    await runMigrations();

    // Run seeds in development
    if (config.env === 'development') {
      await runSeeds();
    }
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

const startServer = async (): Promise<void> => {
  // Initialize database (run migrations and seeds)
  await initializeDatabase();

  // Create HTTP server from Express app
  const httpServer = createServer(app);

  server = httpServer.listen(config.server.port, () => {
    logger.info(`Server started at port: ${config.server.port}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
