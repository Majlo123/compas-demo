import { userRepository, teamMemberRepository, teamRepository } from 'repos/index';
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

export type UserPublic = Pick<UserModel, 'id' | 'fullName' | 'email' | 'vacationDaysInit' | 'vacationDaysLeft'>;

export const findAll = async (query: QueryParams, excludeUserId?: string): Promise<PaginatedResult<any>> => {
  const page = query.pagination?.page || 1;
  const pageSize = query.pagination?.pageSize || 10;
  const activeResult = await findAllActivePaginated(page, pageSize, excludeUserId);
  
  // Fetch teams for each user
  const usersWithTeams = await Promise.all(
    activeResult.data.map(async (u: any) => {
      const teamMembers = await teamMemberRepository.findByUserId(u.id);
      const teams = await Promise.all(
        teamMembers.map(async (tm) => {
          const team = await teamRepository.findById({ id: tm.teamId });
          return team ? { id: team.id, name: team.name } : null;
        })
      );
      return {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        teams: teams.filter(t => t !== null),
      };
    })
  );
  
  return {
    data: activeResult.data.map((u: any) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      vacationDaysInit: u.vacationDaysInit ?? 0,
      vacationDaysLeft: u.vacationDaysLeft ?? 0
    })),
    page: activeResult.page,
    pageSize: activeResult.pageSize,
    totalItems: activeResult.totalItems,
    totalPages: activeResult.totalPages,
  } as PaginatedResult<any>;
};

export const deactivate = async (userId: string): Promise<boolean> => {
  return deactivateUser(userId);
};

export const getUserProfile = async (userId: string): Promise<any> => {
  const user = await userRepository.findById({ id: userId });
  if (!user) return null;

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    emailNotificationsEnabled: user.emailNotificationsEnabled ?? true,
    vacationDaysInit: user.vacationDaysInit ?? 0,
    vacationDaysLeft: user.vacationDaysLeft ?? 0,
  };
};

export const updateEmailNotificationPreference = async (userId: string, emailNotificationsEnabled: boolean): Promise<boolean> => {
  const updated = await userRepository.updateById(userId, { emailNotificationsEnabled });
  return !!updated;
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

/**
 * Check if a user can manage another user's vacation days
 * Admin can manage anyone, Team Manager can manage their team members
 */
export const canManageUserVacationDays = async (
  managerId: string,
  targetUserId: string
): Promise<boolean> => {
  // Get manager details
  const manager = await userRepository.findById({ id: managerId });
  if (!manager) {
    console.error(`Manager with ID ${managerId} not found in database`);
    return false;
  }

  console.log(`Manager role: "${manager.role}", checking if can manage user ${targetUserId}`);

  // Admin can manage anyone - note: comparing as string
  if (manager.role === 'admin') {
    console.log('User is admin, allowing vacation days update');
    return true;
  }

  // Check if manager is a team manager and target user is in one of their teams
  const managerTeamIds = await teamMemberRepository.getTeamsWhereUserIsManager(managerId);

  if (managerTeamIds.length === 0) {
    console.log('Manager is not a team manager');
    return false; // Not a team manager
  }

  // Check if target user is in any of the manager's teams
  const targetUserTeams = await teamMemberRepository.findByUserId(targetUserId);

  const canManage = targetUserTeams.some(membership =>
    managerTeamIds.includes(membership.teamId)
  );

  console.log(`Manager team IDs: ${managerTeamIds}, Target user teams: ${targetUserTeams.map(t => t.teamId)}, Can manage: ${canManage}`);

  return canManage;
};

/**
 * Update vacation days for a user
 * Only Admin or Team Manager (for their team members) can perform this action
 */
export const updateUserVacationDays = async (
  userId: string,
  vacationDaysInit: number,
  vacationDaysLeft: number
): Promise<boolean> => {
  if (vacationDaysInit < 0 || vacationDaysLeft < 0) {
    throw new Error('Vacation days cannot be negative');
  }

  const updated = await userRepository.updateById(userId, { vacationDaysInit, vacationDaysLeft });
  return !!updated;
};

/**
 * Get user with vacation days info
 */
export const getUserWithVacationDays = async (userId: string): Promise<any> => {
  const user = await userRepository.findById({ id: userId });
  if (!user) return null;

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    vacationDaysInit: user.vacationDaysInit ?? 0,
    vacationDaysLeft: user.vacationDaysLeft ?? 0,
  };
};

/**
 * Add vacation days to all active users
 */
export const distributeAnnualLeave = async (days: number): Promise<number> => {
  return userRepository.addVacationDaysToAllActiveUsers(days);
};