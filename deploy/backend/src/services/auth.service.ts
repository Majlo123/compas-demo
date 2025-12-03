import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authRepository, teamMemberRepository, userInviteRepository } from 'repos/index';
import ApiError from 'shared/error/ApiError';
import config from 'config/config';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../../../shared/auth.types';

export const register = async (input: RegisterRequest & { inviteToken?: string }): Promise<RegisterResponse> => {
  const { email, password, fullName, inviteToken } = input;

  const existingUser = await authRepository.findByField('email', email);
  if (existingUser) {
    throw new ApiError('Email already registered', httpStatus.BAD_REQUEST);
  }

  // If inviteToken is provided, verify it
  let inviteId: string | undefined;
  if (inviteToken) {
    const invite = await userInviteRepository.findByToken(inviteToken);
    
    if (!invite) {
      throw new ApiError('Invalid invite token', httpStatus.BAD_REQUEST);
    }
    
    if (invite.status !== 'pending') {
      throw new ApiError('This invite has already been used or revoked', httpStatus.BAD_REQUEST);
    }
    
    if (new Date() > new Date(invite.expiresAt)) {
      await userInviteRepository.updateStatus(invite.id!, 'expired');
      throw new ApiError('This invite has expired', httpStatus.BAD_REQUEST);
    }
    
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
