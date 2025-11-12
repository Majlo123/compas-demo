import config from 'config/config';
import logger from 'config/logger';
import morgan from 'morgan';

morgan.token('message', (_, res) => res.errored?.message || '');

const getIpFormat = (): string => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const successHandler = morgan(successResponseFormat, {
  skip: (_, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (_, res) => res.statusCode < 400,
  stream: {
    write: (message) => {
      const error = new Error(message.trim());
      logger.error(error);
    },
  },
});
