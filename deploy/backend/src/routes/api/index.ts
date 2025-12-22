import express from 'express';
import db from 'database';

const apiRouter = express.Router();

apiRouter.get('/hello', async (req, res) => {
  try {
    const warningLevels = await db('warning_level').select('*');
    res.json(warningLevels);
  } catch (error) {
    console.error('Error fetching warning levels:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default apiRouter;
