import config from 'config/config';
import pino from 'pino';

interface ILogger {
  debug: (message: string) => void;
  trace: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (err: Error) => void;
}

const customLogger = pino({
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  level: config.server.logLevel,
  redact: { paths: ['password'] },
  transport:
    config.env !== 'development'
      ? undefined
      : { target: 'pino-pretty', options: { colorize: true } },
});

const logger: ILogger = {
  debug: (message: string) => {
    customLogger.debug(message);
  },
  trace: (message: string) => {
    customLogger.trace(message);
  },
  info: (message: string) => {
    customLogger.info(message);
  },
  warn: (message: string) => {
    customLogger.warn(message);
  },
  error: (err: Error) => {
    const { message, stack } = err;
    customLogger.error({ message, stack });
  },
};

export default logger;
