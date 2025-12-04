import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authRepository, teamMemberRepository, userInviteRepository } from 'repos/index';
import ApiError from 'shared/error/ApiError';
import config from 'config/config';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../../../shared/auth.types';
import { verifyInviteToken } from './userInvite.service';

export const register = async (input: RegisterRequest & { inviteToken?: string }): Promise<RegisterResponse> => {
  const { email, password, fullName, inviteToken } = input;

  const existingUser = await authRepository.findByField('email', email);
  if (existingUser) {
    throw new ApiError('Email already registered', httpStatus.BAD_REQUEST);
  }

  // If inviteToken is provided, verify it
  let inviteId: string | undefined;
  if (inviteToken) {
    const invite = await verifyInviteToken(inviteToken);
    
    if (invite.email.toLowerCase() !== email.toLowerCase()) {
      throw new ApiError('Email does not match the invited email', httpStatus.BAD_REQUEST);
    }
    
    inviteId = invite.id;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await authRepository.create({
    email,
    passwordHash,
    fullName,
    role: 'employee',
  });

  // Mark invite as accepted if it was provided
  if (inviteId) {
    await userInviteRepository.updateStatus(inviteId, 'accepted', new Date());
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
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
      role: user.role,
    },
  };
};

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { email, password } = credentials;

  const user = await authRepository.findByField('email', email);
  if (!user) {
    throw new ApiError('Invalid email or password', httpStatus.BAD_REQUEST);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError('Invalid email or password', httpStatus.BAD_REQUEST);
  }

  // Check if user account is activated
  if (user.isActivated === false) {
    throw new ApiError('Your account has been deactivated', httpStatus.FORBIDDEN);
  }

  // Check if user is a team manager
  const isTeamManager = await teamMemberRepository.isUserManagerOfAnyTeam(user.id!);

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
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
      role: user.role,
      isTeamManager,
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

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const user = await authRepository.findById({ id: userId });
  
  if (!user) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }

  // Verify current password
  const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError('Current password is incorrect', httpStatus.BAD_REQUEST);
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  // Update password in database
  await authRepository.updateById(user.id!, { passwordHash: newPasswordHash });

  return {
    success: true,
    message: 'Password changed successfully',
  };
};
