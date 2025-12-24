import express from 'express';
import createWarningLevelRoute from 'routes/api/warningLevel.route';

const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Warning Levels Routes
apiRouter.use('/warning-levels', createWarningLevelRoute('/warning-levels'));

export default apiRouter;
