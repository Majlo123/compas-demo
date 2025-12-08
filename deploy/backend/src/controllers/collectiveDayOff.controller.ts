import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { collectiveDayOffService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';

export const getAllCollectiveDaysOff = catchAsync(async (_req: Request, res: Response) => {
  const daysOff = await collectiveDayOffService.getAllCollectiveDaysOff();
  res.status(httpStatus.OK).send({
    success: true,
    content: daysOff,
  });
});

export const getCollectiveDaysOffByDateRange = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'startDate and endDate query parameters are required' },
    });
    return;
  }

  const daysOff = await collectiveDayOffService.getCollectiveDaysOffByDateRange(
    String(startDate),
    String(endDate)
  );
  
  res.status(httpStatus.OK).send({
    success: true,
    content: daysOff,
  });
});

export const createCollectiveDayOff = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate, description } = req.body;

  if (!startDate || !endDate || !description) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'startDate, endDate, and description are required' },
    });
    return;
  }

  const newDayOff = await collectiveDayOffService.createCollectiveDayOff({
    startDate,
    endDate,
    description,
  });

  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Collective day off created successfully',
    content: newDayOff,
  });
});

export const deleteCollectiveDayOff = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await collectiveDayOffService.deleteCollectiveDayOff(id);
    res.status(httpStatus.OK).send({
      success: true,
      message: 'Collective day off deleted successfully',
      content: { deleted: true },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Collective day off not found') {
      res.status(httpStatus.NOT_FOUND).send({
        success: false,
        error: { message: 'Collective day off not found' },
      });
      return;
    }
    throw error;
  }
});
