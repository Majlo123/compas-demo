import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as warningLevelService from 'services/warningLevel.service';
import ApiError from 'shared/error/ApiError';
import catchAsync from 'shared/utils/CatchAsync';

export const searchWarningLevels = catchAsync(async (req: Request, res: Response) => {
  const query = (req.query.query as string) || '';
  const result = await warningLevelService.search(query);
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const getAllWarningLevels = catchAsync(async (_req: Request, res: Response) => {
  const result = await warningLevelService.findAll();
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const getWarningLevelById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await warningLevelService.findById(id);

  if (!result) {
    throw new ApiError('Warning level not found', httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const createWarningLevel = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'Name is required and must be a non-empty string' },
    });
    return;
  }

  try {
    const result = await warningLevelService.create({
      name: name.trim(),
      description: description || null,
    });

    res.status(httpStatus.CREATED).send({
      success: true,
      content: result,
    });
  } catch (error: any) {
    res.status(httpStatus.CONFLICT).send({
      success: false,
      error: { message: error.message },
    });
  }
});

export const updateWarningLevel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;

    const result = await warningLevelService.update(id, updateData);

    res.status(httpStatus.OK).send({
      success: true,
      content: result,
    });
  } catch (error: any) {
    if (error.message.includes('not found')) {
      throw new ApiError(error.message, httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.CONFLICT).send({
      success: false,
      error: { message: error.message },
    });
  }
});

export const deleteWarningLevel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const success = await warningLevelService.deleteWarningLevel(id);

    res.status(httpStatus.OK).send({
      success: true,
      content: { deleted: success },
    });
  } catch (error: any) {
    if (error.message.includes('not found')) {
      throw new ApiError(error.message, httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      error: { message: error.message },
    });
  }
});
