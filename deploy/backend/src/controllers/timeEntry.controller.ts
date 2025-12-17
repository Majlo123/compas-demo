import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from 'shared/utils/CatchAsync';
import * as timeEntryService from 'services/timeEntry.service';

export const createTimeEntry = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).send({
      success: false,
      error: { message: 'Unauthorized' },
    });
    return;
  }

  const { projectName, description, startDate, timeSpentMinutes, isOvertime, isBillable } = req.body;
  const timeEntry = await timeEntryService.createTimeEntry({
    userId,
    projectName,
    description,
    startDate,
    timeSpentMinutes,
    isOvertime,
    isBillable,
  });

  res.status(httpStatus.CREATED).send({
    success: true,
    content: timeEntry,
  });
});

export const getUserTimeEntries = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).send({
      success: false,
      error: { message: 'Unauthorized' },
    });
    return;
  }

  const { startDate, endDate } = req.query;
  const timeEntries = await timeEntryService.getUserTimeEntries(userId, {
    startDate: startDate as string,
    endDate: endDate as string,
  });

  res.status(httpStatus.OK).send({
    success: true,
    content: timeEntries,
  });
});

export const getTimeEntryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const timeEntry = await timeEntryService.getTimeEntryById(id);

  if (!timeEntry) {
    res.status(httpStatus.NOT_FOUND).send({
      success: false,
      error: { message: 'Time entry not found' },
    });
    return;
  }

  res.status(httpStatus.OK).send({
    success: true,
    content: timeEntry,
  });
});

export const updateTimeEntry = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const existingEntry = await timeEntryService.getTimeEntryById(id);
  if (!existingEntry || existingEntry.userId !== userId) {
    res.status(httpStatus.FORBIDDEN).send({
      success: false,
      error: { message: 'Cannot update this time entry' },
    });
    return;
  }

  const { projectName, description, timeSpentMinutes, isOvertime, isBillable } = req.body;
  const updated = await timeEntryService.updateTimeEntry(id, {
    projectName,
    description,
    timeSpentMinutes,
    isOvertime,
    isBillable,
  });

  res.status(httpStatus.OK).send({
    success: true,
    content: updated,
  });
});

export const deleteTimeEntry = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const existingEntry = await timeEntryService.getTimeEntryById(id);
  if (!existingEntry || existingEntry.userId !== userId) {
    res.status(httpStatus.FORBIDDEN).send({
      success: false,
      error: { message: 'Cannot delete this time entry' },
    });
    return;
  }

  await timeEntryService.deleteTimeEntry(id);

  res.status(httpStatus.OK).send({
    success: true,
    content: { deleted: true },
  });
});
