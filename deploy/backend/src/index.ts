import app from 'app';
import config from 'config/config';
import logger from 'config/logger';
import { initializeSocket } from 'config/socket';
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

const startServer = async (): Promise<void> => {
  // Create HTTP server from Express app
  const httpServer = createServer(app);

  // Initialize Socket.IO
  initializeSocket(httpServer);

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
