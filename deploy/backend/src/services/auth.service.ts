import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authRepository } from 'repos/index';
import ApiError from 'shared/error/ApiError';
import config from 'config/config';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
};

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { email, password } = credentials;

  const user = await authRepository.findByField('email', email);
  if (!user) {
    throw new ApiError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn as any,
    }
  );

  return {
    token,
    user: {
      id: user.id!,
      email: user.email,
      fullName: user.fullName,
    },
  };
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new ApiError('Invalid or expired token', httpStatus.UNAUTHORIZED);
  }
};
