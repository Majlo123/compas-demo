import { Request, Response, NextFunction } from 'express';

const noCacheHeaders = (_: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('ETag', 'no-etag');

  next();
};

export default noCacheHeaders;
