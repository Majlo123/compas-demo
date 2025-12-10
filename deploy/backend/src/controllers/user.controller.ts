import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';
import QueryParams from 'repos/utils/query/QueryParams';
import ApiError from 'shared/error/ApiError';

export const searchUsers = catchAsync(async (req: Request, res: Response) => {
  const query = (req.query.query as string) || '';
  const result = await userService.searchUsers(query);
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const queryParams = req.queryParams as QueryParams;
  const currentUserId = req.user?.id;
  const paginatedResult = await userService.findAll(queryParams, currentUserId);
  res.status(httpStatus.OK).send({
    success: true,
    content: paginatedResult,
  });
});

export const inviteUsers = catchAsync(async (req: Request, res: Response) => {
  const { emails } = req.body;
  if (!Array.isArray(emails) || emails.length === 0) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'Emails array required' },
    });
    return;
  }
  const result = await userService.inviteUsers(emails);
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const deactivateUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const success = await userService.deactivate(userId);
  if (!success) {
    res.status(httpStatus.NOT_FOUND).send({
      success: false,
      error: { message: 'User not found' },
    });
    return;
  }
  res.status(httpStatus.OK).send({
    success: true,
    content: { deactivated: true },
  });
});

export const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError('Unauthorized', httpStatus.UNAUTHORIZED);
  }
  const profile = await userService.getUserProfile(userId);
  if (!profile) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }
  res.status(httpStatus.OK).send({
    success: true,
    content: profile,
  });
});

export const updateEmailNotificationPreference = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError('Unauthorized', httpStatus.UNAUTHORIZED);
  }
  const { emailNotificationsEnabled } = req.body;
  if (typeof emailNotificationsEnabled !== 'boolean') {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'emailNotificationsEnabled must be a boolean' },
    });
    return;
  }
  const updated = await userService.updateEmailNotificationPreference(userId, emailNotificationsEnabled);
  if (!updated) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }
  res.status(httpStatus.OK).send({
    success: true,
    content: { emailNotificationsEnabled },
  });
});

export const updateUserVacationDays = catchAsync(async (req: Request, res: Response) => {
  const requesterId = req.user?.id;
  const { userId } = req.params;
  let { vacationDaysInit, vacationDaysLeft, isAnnualLeaveAddition } = req.body;

  console.log(`Update vacation days request - Requester: ${requesterId}, Target User: ${userId}, Init: ${vacationDaysInit}, Left: ${vacationDaysLeft}, IsAnnual: ${isAnnualLeaveAddition}`);
  console.log(`Requester user object:`, req.user);

  if (!requesterId) {
    throw new ApiError('Unauthorized', httpStatus.UNAUTHORIZED);
  }

  if (typeof vacationDaysInit !== 'number' || vacationDaysInit < 0 || typeof vacationDaysLeft !== 'number' || vacationDaysLeft < 0) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'vacationDaysInit and vacationDaysLeft must be non-negative numbers' },
    });
    return;
  }

  // If adding annual leave (21+), set both init and left to the same value
  if (isAnnualLeaveAddition && vacationDaysInit >= 21) {
    vacationDaysLeft = vacationDaysInit;
  }

  // Check if requester has permission to update this user's vacation days
  const canManage = await userService.canManageUserVacationDays(requesterId, userId);

  if (!canManage) {
    // Provide more specific error message
    const requesterUser = await userService.getUserWithVacationDays(requesterId);
    if (!requesterUser) {
      throw new ApiError(
        'Your user session is invalid. Please log out and log back in.',
        httpStatus.UNAUTHORIZED
      );
    }

    throw new ApiError(
      'Forbidden: You do not have permission to update this user\'s vacation days. Only Admins and Team Managers can modify vacation days.',
      httpStatus.FORBIDDEN
    );
  }

  const updated = await userService.updateUserVacationDays(userId, vacationDaysInit, vacationDaysLeft);

  if (!updated) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).send({
    success: true,
    message: 'Vacation days updated successfully',
    content: { vacationDaysInit, vacationDaysLeft },
  });
});

export const getUserVacationDays = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await userService.getUserWithVacationDays(userId);

  if (!user) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).send({
    success: true,
    content: user,
  });
});

export const distributeAnnualLeave = catchAsync(async (req: Request, res: Response) => {
  const { days } = req.body;

  if (typeof days !== 'number' || days < 0) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'days must be a non-negative number' },
    });
    return;
  }

  const updatedCount = await userService.distributeAnnualLeave(days);

  res.status(httpStatus.OK).send({
    success: true,
    message: `Successfully added ${days} vacation days to ${updatedCount} users`,
    content: { updatedCount },
  });
});

export const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
  const { profileImageBlob } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError('User not authenticated', httpStatus.UNAUTHORIZED);
  }

  if (!profileImageBlob || typeof profileImageBlob !== 'string') {
    throw new ApiError('profileImageBlob is required and must be a string', httpStatus.BAD_REQUEST);
  }

  const updated = await userService.updateProfileImage(userId, profileImageBlob);

  res.status(httpStatus.OK).send({
    success: true,
    message: 'Profile image updated successfully',
    content: { profileImageBlob: updated.profileImageBlob },
  });
});

