import config from 'config/config';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { authService } from 'services';
import ApiError from 'shared/error/ApiError';
import { Role } from '../../../shared/auth.types';
import { teamMemberRepository } from 'repos';

export const authorize = (allowedRoles?: Role[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
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
        role: decoded.role,
        isTeamManager: decoded.isTeamManager || false,
      };

      // Check roles if provided
      if (allowedRoles && allowedRoles.length > 0) {
        const user = (req as any).user;
        if (!allowedRoles.includes(user.role)) {
          throw new ApiError('Forbidden: insufficient permissions', httpStatus.FORBIDDEN);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authorizeDashboard = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;

    if (!user) {
      throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
    }

    // Admins always have access
    if (user.role === 'admin') {
      return next();
    }

    // For employees, check if they are a team manager
    if (user.role === 'employee') {
      const isManager = await teamMemberRepository.isUserManagerOfAnyTeam(user.id);
      if (!isManager) {
        throw new ApiError('Forbidden: only managers and admins can access dashboard', httpStatus.FORBIDDEN);
      }
    }

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
