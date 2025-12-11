import config from 'config/config';
import { successHandler, errorHandler } from 'config/morgan';
import * as cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { errorConverter, errorHandler as apiErrorHandler } from 'middlewares/error';
import apiRouter from 'routes/api';
import healthcheckRouter from 'routes/healthcheck/healthcheck.route';

const app = express();

if (config.env !== 'test') {
  app.use(successHandler);
  app.use(errorHandler);
}

// Parse request body as json and set a limit of 10MB (to accommodate base64 encoded images)
app.use(express.json({ limit: '10mb' }));
// Parse urlencoded body and set a limit of 1MB
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// Allow Node to get real IP address even if behind proxy
app.enable('trust proxy');

// Parse cookies more easily
app.use(cookieParser.default());

// Secure HTTP headers
/* eslint-disable quotes */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
  }),
);
/* eslint-enable quotes */

app.use(
  cors({
    origin: `${config.corsAllowed}`.split(','),
    credentials: true,
    exposedHeaders: 'token',
  }),
);

app.use('/api', apiRouter);
app.use('/', healthcheckRouter);

// Convert Error to ApiError if needed
app.use(errorConverter);

// Handle Errors
app.use(apiErrorHandler);

export default app;
