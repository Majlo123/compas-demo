import cors from 'cors';
import { swaggerDocs } from 'docs/swagger';
import express from 'express';
import apiRouter from 'routes/api';

const app = express();

// Parse request body as json
app.use(express.json({ limit: '10mb' }));
// Parse urlencoded body
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// Allow Node to get real IP address even if behind proxy
app.enable('trust proxy');

app.use(
  cors({
    origin: '*', // Simplified for demo
    credentials: true,
  }),
);

// Setup Swagger documentation
swaggerDocs(app, {
  title: 'Compas Demo API',
  description: 'API documentation for Compas Demo',
  version: '1.0.0',
  serverUrl: process.env.API_URL || 'http://localhost/api',
});

app.use('/api', apiRouter);

export default app;
