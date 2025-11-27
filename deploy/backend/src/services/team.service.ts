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

/**
 * Add a member to a team
 */
export const addMemberToTeam = async (teamId: string, userId: string): Promise<TeamMember> => {
  const team = await teamRepository.findById({ id: teamId });
  if (!team) {
    throw new ApiError('Team not found', httpStatus.NOT_FOUND);
  }

  const user = await authRepository.findById({ id: userId });
  if (!user) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }

  const existingMembers = await teamMemberRepository.findByTeamId(teamId);
  if (existingMembers.some((m) => m.userId === userId)) {
    throw new ApiError('User is already a member of this team', httpStatus.CONFLICT);
  }

  const created = await teamMemberRepository.create({ teamId, userId } as CreateTeamMember);
  return created as TeamMember;
};

export const removeMemberFromTeam = async (teamId: string, userId: string): Promise<TeamMember> => {
  const members = await teamMemberRepository.findByTeamId(teamId);
  const member = members.find((m) => m.userId === userId);
  if (!member) {
    throw new ApiError('Member not found on team', httpStatus.NOT_FOUND);
  }

  const deleted = await teamMemberRepository.deleteById(member.id!);
  if (!deleted) {
    throw new ApiError('Failed to remove member', httpStatus.INTERNAL_SERVER_ERROR);
  }

  return deleted as TeamMember;
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
export const addMember = addMemberToTeam;
export const removeMember = removeMemberFromTeam;
export const listMembers = listTeamMembers;
export const deleteTeam = deleteTeamById;
