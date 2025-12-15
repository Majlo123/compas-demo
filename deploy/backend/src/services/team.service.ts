import httpStatus from 'http-status';
import { teamRepository } from 'repos/index';
import { teamMemberRepository } from 'repos/index';
import { authRepository } from 'repos/index';
import { userRepository } from 'repos/index';
import { CreateTeam, Team } from 'repos/team.model';
import { CreateTeamMember, TeamMember } from 'repos/teamMember.model';
import QueryParams from 'repos/utils/query/QueryParams';
import { PaginatedResult } from 'repos/utils/pagination';
import ApiError from 'shared/error/ApiError';

/**
 * Create a new team
 */
export const createTeam = async (entity: CreateTeam): Promise<Team> => {
  // ensure unique team name
  const existing = await teamRepository.findByField('name', entity.name);
  if (existing) {
    throw new ApiError('Team with this name already exists', httpStatus.CONFLICT);
  }

  const created = await teamRepository.create(entity);
  return created;
};

export const getTeamById = async (id: string): Promise<Team> => {
  const entity = await teamRepository.findById({ id });
  if (!entity) {
    throw new ApiError(`Team with id ${id} not found`, httpStatus.NOT_FOUND);
  }
  return entity;
};

export const listTeams = async (query: QueryParams): Promise<PaginatedResult<Team>> => {
  const result = await teamRepository.findAll({ queryParams: query });
  
  // Add memberCount to each team
  const teamsWithCounts = await Promise.all(
    result.data.map(async (team) => {
      const members = await teamMemberRepository.findByTeamId(team.id!);
      return {
        ...team,
        memberCount: members.length,
      };
    })
  );

  return {
    ...result,
    data: teamsWithCounts,
  };
};

export const listTeamsByUserId = async (userId: string): Promise<Team[]> => {
  const teamMembers = await teamMemberRepository.findByUserId(userId);
  const teamIds = teamMembers.map(tm => tm.teamId);
  
  if (teamIds.length === 0) {
    return [];
  }
  
  const teams: Team[] = [];
  for (const teamId of teamIds) {
    const team = await teamRepository.findById({ id: teamId });
    if (team) {
      teams.push(team);
    }
  }
  
  return teams;
};

export const listTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  // validate team exists
  const team = await teamRepository.findById({ id: teamId });
  if (!team) {
    throw new ApiError('Team not found', httpStatus.NOT_FOUND);
  }

  return teamMemberRepository.findByTeamId(teamId);
};

/**
 * Bulk add members to team
 */
export const bulkAddMembersToTeam = async (
  teamId: string,
  members: Array<{ userId: string; isManager?: boolean }>
): Promise<TeamMember[]> => {
  const team = await teamRepository.findById({ id: teamId });
  if (!team) {
    throw new ApiError('Team not found', httpStatus.NOT_FOUND);
  }

  const existingMembers = await teamMemberRepository.findByTeamId(teamId);
  const results: TeamMember[] = [];

  for (const member of members) {
    const user = await authRepository.findById({ id: member.userId });
    if (!user) {
      continue; // Skip invalid users
    }

    if (existingMembers.some((m) => m.userId === member.userId)) {
      continue; // Skip already existing members
    }

    const created = await teamMemberRepository.create({
      teamId,
      userId: member.userId,
      isManager: member.isManager || false,
    } as CreateTeamMember);
    results.push(created as TeamMember);
  }

  return results;
};

/**
 * Bulk remove members from team
 */
export const bulkRemoveMembersFromTeam = async (
  teamId: string,
  userIds: string[]
): Promise<TeamMember[]> => {
  const members = await teamMemberRepository.findByTeamId(teamId);
  const results: TeamMember[] = [];

  for (const userId of userIds) {
    const member = members.find((m) => m.userId === userId);
    if (!member || !member.id) {
      continue; // Skip non-existent members
    }

    const deleted = await teamMemberRepository.deleteById(member.id);
    if (deleted) {
      results.push(deleted as TeamMember);
    }
  }

  return results;
};

/**
 * Bulk update members manager status
 */
export const bulkUpdateMembersManager = async (
  teamId: string,
  members: Array<{ userId: string; isManager: boolean }>
): Promise<TeamMember[]> => {
  const team = await teamRepository.findById({ id: teamId });
  if (!team) {
    throw new ApiError('Team not found', httpStatus.NOT_FOUND);
  }

  const results: TeamMember[] = [];

  for (const member of members) {
    const updated = await teamMemberRepository.updateTeamMemberManager(
      teamId,
      member.userId,
      member.isManager
    );
    if (updated) {
      results.push(updated);
    }
  }

  return results;
};

/**
 * Remove manager role from members (only Admin or existing Team Manager can do this)
 */
export const removeManagerRole = async (
  teamId: string,
  requesterId: string,
  members: Array<{ userId: string }>
): Promise<TeamMember[]> => {
  const team = await teamRepository.findById({ id: teamId });
  if (!team) {
    throw new ApiError('Team not found', httpStatus.NOT_FOUND);
  }

  // Check if requester is Admin or a Team Manager of this team
  const requester = await userRepository.findById({ id: requesterId });
  if (!requester) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }

  // If not Admin, check if they are a manager of this team
  if (requester.role !== 'admin') {
    const isManagerOfTeam = await teamMemberRepository.findOne({
      team_id: teamId,
      user_id: requesterId,
      is_manager: true,
    });

    if (!isManagerOfTeam) {
      throw new ApiError(
        'Only team managers or admins can remove manager roles',
        httpStatus.FORBIDDEN
      );
    }
  }

  const results: TeamMember[] = [];

  for (const member of members) {
    const updated = await teamMemberRepository.updateTeamMemberManager(
      teamId,
      member.userId,
      false
    );
    if (updated) {
      results.push(updated);
    }
  }

  return results;
};

/**
 * Delete a team by id (cascades team_members via FK)
 */
export const deleteTeamById = async (id: string): Promise<Team> => {
  const team = await teamRepository.findById({ id });
  if (!team) {
    throw new ApiError('Team not found', httpStatus.NOT_FOUND);
  }

  const deleted = await teamRepository.deleteById(id);
  if (!deleted) {
    throw new ApiError('Failed to delete team', httpStatus.INTERNAL_SERVER_ERROR);
  }

  return deleted as Team;
};

/**
 * Get teams that are not assigned to any client
 */
export const listUnassignedTeams = async (): Promise<Team[]> => {
  const allTeams = await teamRepository.findAll({ queryParams: {} as QueryParams });
  const unassignedTeams = allTeams.data.filter((team) => !team.clientId);
  return unassignedTeams;
};

// Backwards-compatible aliases (optional)
export const create = createTeam;
export const findById = getTeamById;
export const findAll = listTeams;
export const findByUserId = listTeamsByUserId;
export const listMembers = listTeamMembers;
export const deleteTeam = deleteTeamById;
