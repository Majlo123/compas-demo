import httpStatus from 'http-status';
import { teamRepository } from 'repos/index';
import { teamMemberRepository } from 'repos/index';
import { authRepository } from 'repos/index';
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
  return teamRepository.findAll({ queryParams: query });
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

// Backwards-compatible aliases (optional)
export const create = createTeam;
export const findById = getTeamById;
export const findAll = listTeams;
export const listMembers = listTeamMembers;
export const deleteTeam = deleteTeamById;
