import config from 'config/config';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { authService } from 'services';
import ApiError from 'shared/error/ApiError';

export const authorize = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No token provided', httpStatus.UNAUTHORIZED);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = authService.verifyToken(token);
    
    (req as any).user = {
      id: decoded.sub,
      email: decoded.email,
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

export const checkJobApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const jobKey = req.headers['x-api-key'];
  if (jobKey !== config.jobApiKey) {
    res.status(403).send('Forbidden');
    return;
  }
  next();
};
