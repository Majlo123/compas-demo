import { userRepository } from 'repos/index';
import { deactivateUser, findAllActivePaginated } from 'repos/user.model';
import QueryParams from 'repos/utils/query/QueryParams';
import { PaginatedResult } from 'repos/utils/pagination';
import { User as UserModel } from 'repos/user.model';
import { createUserInvite } from './userInvite.service';

/**
 * Search users by name or email
 */
export const searchUsers = async (searchQuery: string): Promise<any[]> => {
  return userRepository.searchByNameOrEmail(searchQuery);
};

export type UserPublic = Pick<UserModel, 'id' | 'fullName' | 'email'>;

export const findAll = async (query: QueryParams): Promise<PaginatedResult<UserPublic>> => {
  const page = query.pagination?.page || 1;
  const pageSize = query.pagination?.pageSize || 10;
  const activeResult = await findAllActivePaginated(page, pageSize);
  return {
    data: activeResult.data.map((u: any) => ({ id: u.id, fullName: u.fullName, email: u.email })),
    page: activeResult.page,
    pageSize: activeResult.pageSize,
    totalItems: activeResult.totalItems,
    totalPages: activeResult.totalPages,
  } as PaginatedResult<UserPublic>;
};

export const deactivate = async (userId: string): Promise<boolean> => {
  return deactivateUser(userId);
};

/**
 * Invite multiple users
 * Returns results for each email - both successful and failed invitations
 */
export type InviteUsersResult = {
  invited: Array<{ email: string; inviteId: string }>;
  failed: Array<{ email: string; reason: string }>;
};

export const inviteUsers = async (emails: string[]): Promise<InviteUsersResult> => {
  const result: InviteUsersResult = {
    invited: [],
    failed: [],
  };

  // Process each email invitation
  for (const email of emails) {
    try {
      const invite = await createUserInvite({ email: email.trim().toLowerCase() });
      result.invited.push({
        email: invite.email,
        inviteId: invite.inviteId,
      });
    } catch (error: any) {
      result.failed.push({
        email,
        reason: error.message || 'Failed to create invite',
      });
    }
  }

  return result;
};


