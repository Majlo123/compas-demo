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
    // Accept either standard Authorization header or legacy/custom 'token' header
    const authHeader = (req.headers.authorization as string) || (req.headers.token as string);

    if (!authHeader) {
      throw new ApiError('No token provided', httpStatus.UNAUTHORIZED);
    }

    // Support both 'Bearer <token>' and raw token formats
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

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
