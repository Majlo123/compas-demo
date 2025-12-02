import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { teamService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';
import ApiError from 'shared/error/ApiError';

export const createTeam = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const created = await teamService.createTeam(payload);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Team created successfully',
    content: created,
  });
});

export const getTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const team = await teamService.getTeamById(id);

  res.status(httpStatus.OK).send({
    success: true,
    content: team,
  });
});

export const listTeams = catchAsync(async (req: Request, res: Response) => {
  const result = await teamService.listTeams(req.queryParams);
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const listTeamsByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const teams = await teamService.listTeamsByUserId(userId);
  res.status(httpStatus.OK).send({
    success: true,
    content: { data: teams },
  });
});

export const listMembers = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const members = await teamService.listTeamMembers(teamId);
  res.status(httpStatus.OK).send({
    success: true,
    content: members,
  });
});

export const bulkAddMembers = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { members } = req.body;

  if (!members || !Array.isArray(members) || members.length === 0) {
    throw new ApiError('members array is required', httpStatus.BAD_REQUEST);
  }

  const results = await teamService.bulkAddMembersToTeam(teamId, members);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: `${results.length} members added to team`,
    content: results,
  });
});

export const bulkRemoveMembers = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { userIds } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new ApiError('userIds array is required', httpStatus.BAD_REQUEST);
  }

  const results = await teamService.bulkRemoveMembersFromTeam(teamId, userIds);
  res.status(httpStatus.OK).send({
    success: true,
    message: `${results.length} members removed from team`,
    content: results,
  });
});

export const bulkUpdateMembersManager = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { members } = req.body;

  if (!members || !Array.isArray(members) || members.length === 0) {
    throw new ApiError('members array is required', httpStatus.BAD_REQUEST);
  }

  const results = await teamService.bulkUpdateMembersManager(teamId, members);
  res.status(httpStatus.OK).send({
    success: true,
    message: `${results.length} members updated`,
    content: results,
  });
});

export const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await teamService.deleteTeam(id);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Team deleted successfully',
    content: deleted,
  });
});
