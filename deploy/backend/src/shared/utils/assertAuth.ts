import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

function assertAuthenticatedUser(req: Request): asserts req is AuthenticatedRequest {
  if (!req.user) {
    throw new Error(
      'User not present on the request, should only be used with routes protected by auth middleware',
    );
  }

  if (!req.user.id || !req.user.role) {
    throw new Error(
      'Expected user fields not present on the request, should only be used with routes protected by auth middleware',
    );
  }
}

export default assertAuthenticatedUser;
