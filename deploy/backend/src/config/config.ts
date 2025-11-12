import dotenv from 'dotenv';
import { cleanEnv, EnvError, EnvMissingError, num, str } from 'envalid';
import * as path from 'path';

dotenv.config({ path: path.resolve(`${__dirname}/../../.env`) });

const envVars = cleanEnv(
  process.env,
  {
    NODE_ENV: str(),
    APP_ENVIRONMENT: str(),
    APP_PORT: num(),
    API_URL: str(),
    APP_LOG_LEVEL: str(),
    FRONTEND_URL: str(),
    CORS_ALLOWED: str(),
    SERVICE_API_KEY: str(),
    JOB_API_KEY: str(),
  },
  {
    reporter: ({ errors }) => {
      /* eslint-disable no-unreachable-loop, no-restricted-syntax */
      for (const [environmentVariable, error] of Object.entries(errors)) {
        if (error instanceof EnvError) {
          throw new EnvError(`${environmentVariable} EnvError ${error}`);
        } else if (error instanceof EnvMissingError) {
          throw new EnvMissingError(`${environmentVariable} EnvMissingError ${error}`);
        } else {
          throw new TypeError(`${environmentVariable} error ${error}`);
        }
      }
    },
  },
);

const config = {
  nodeEnv: envVars.NODE_ENV,
  env: envVars.APP_ENVIRONMENT,
  server: {
    port: envVars.APP_PORT,
    api_url: envVars.API_URL,
    logLevel: envVars.APP_LOG_LEVEL,
  },
  frontendUrl: envVars.FRONTEND_URL,
  corsAllowed: envVars.CORS_ALLOWED,
  serviceApiKey: envVars.SERVICE_API_KEY,
  jobApiKey: envVars.JOB_API_KEY,
};

export default config;
