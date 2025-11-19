import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authRepository } from 'repos/index';
import ApiError from 'shared/error/ApiError';
import config from 'config/config';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../../../shared/auth.types';

export const register = async (input: RegisterRequest): Promise<RegisterResponse> => {
  const { email, password, fullName } = input;

  const existingUser = await authRepository.findByField('email', email);
  if (existingUser) {
    throw new ApiError('Email already registered', httpStatus.BAD_REQUEST);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await authRepository.create({
    email,
    passwordHash,
    fullName,
  });

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

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
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
