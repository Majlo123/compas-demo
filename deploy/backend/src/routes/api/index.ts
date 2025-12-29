import express from 'express';
import createParLevelRoute from 'routes/api/parLevel.route';
import createWarningLevelRoute from 'routes/api/warningLevel.route';

const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Warning Levels Routes
apiRouter.use('/warning-levels', createWarningLevelRoute('/warning-levels'));

// PAR Levels Routes
apiRouter.use('/par-levels', createParLevelRoute('/par-levels'));

export default apiRouter;
