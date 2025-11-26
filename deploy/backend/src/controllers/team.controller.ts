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

export const addMember = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError('userId is required', httpStatus.BAD_REQUEST);
  }

  const created = await teamService.addMemberToTeam(teamId, userId);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Member added to team',
    content: created,
  });
});

export const removeMember = catchAsync(async (req: Request, res: Response) => {
  const { teamId, userId } = req.params;
  const removed = await teamService.removeMemberFromTeam(teamId, userId);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Member removed from team',
    content: removed,
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
