import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userInviteRepository, authRepository } from 'repos/index';
import ApiError from 'shared/error/ApiError';
import config from 'config/config';
import { sendInvitationEmail } from './email.service';

export type CreateUserInviteInput = {
  email: string;
};

export type CreateUserInviteResponse = {
  inviteId: string;
  token: string;
  email: string;
  expiresAt: Date;
};

/**
 * Generate a unique signed token for the invite
 */
const generateInviteToken = (email: string): string => {
  const randomString = crypto.randomBytes(32).toString('hex');
  const payload = {
    email,
    random: randomString,
    type: 'invite',
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: '48h',
  });
};

/**
 * Create a user invite
 */
export const createUserInvite = async (
  input: CreateUserInviteInput
): Promise<CreateUserInviteResponse> => {
  const { email } = input;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError('Invalid email format', httpStatus.BAD_REQUEST);
  }

  // Check if user with this email already exists
  const existingUser = await authRepository.findByField('email', email);
  if (existingUser) {
    throw new ApiError('User with this email already has an active account', httpStatus.BAD_REQUEST);
  }

  // Check if there's already a pending invite for this email
  const existingInvite = await userInviteRepository.findPendingByEmail(email);
  if (existingInvite) {
    throw new ApiError('Pending invite already exists for this email', httpStatus.BAD_REQUEST);
  }

  // Generate token
  const token = generateInviteToken(email);

  // Set expiration to 48 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  // Create invite with status automatically set to 'pending' by database
  const invite = await userInviteRepository.create({
    email,
    token,
    expiresAt,
  });

  // Send invitation email
  try {
    await sendInvitationEmail(email, token);
  } catch (error) {
    // Log error but don't fail the invite creation
    // The invite is still valid even if email fails
    console.error('Failed to send invitation email:', error);
  }

  return {
    inviteId: invite.id!,
    token: invite.token,
    email: invite.email,
    expiresAt: invite.expiresAt,
  };
};

/**
 * Verify invite token
 */
export const verifyInviteToken = async (token: string) => {
  // Find invite by token
  const invite = await userInviteRepository.findByToken(token);

  if (!invite) {
    throw new ApiError('Invalid invite token', httpStatus.BAD_REQUEST);
  }

  if (invite.status !== 'pending') {
    throw new ApiError('This invite has already been used or revoked', httpStatus.BAD_REQUEST);
  }

  if (new Date() > new Date(invite.expiresAt)) {
    // Mark as expired
    await userInviteRepository.updateStatus(invite.id!, 'expired');
    throw new ApiError('This invite has expired', httpStatus.BAD_REQUEST);
  }

  return invite;
};
