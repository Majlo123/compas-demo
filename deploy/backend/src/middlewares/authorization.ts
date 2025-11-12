import config from 'config/config';
import { NextFunction, Request, Response } from 'express';

export const authorize = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  res.status(501).json({
    message: 'Authorization middleware not implemented.',
  });
};

export const checkJobApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const jobKey = req.headers['x-api-key'];
  if (jobKey !== config.jobApiKey) {
    res.status(403).send('Forbidden');
    return;
  }
  next();
};
