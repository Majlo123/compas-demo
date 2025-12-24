import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as warningLevelService from 'services/warningLevel.service';
import catchAsync from 'shared/utils/CatchAsync';
import ApiError from 'shared/error/ApiError';

export const searchWarningLevels = catchAsync(async (req: Request, res: Response) => {
  const query = (req.query.query as string) || '';
  const result = await warningLevelService.search(query);
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const getAllWarningLevels = catchAsync(async (req: Request, res: Response) => {
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
  const { name, description, level, color } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'Name is required and must be a non-empty string' },
    });
    return;
  }

  if (typeof level !== 'number' || level < 0 || level > 100) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'Level must be a number between 0 and 100' },
    });
    return;
  }

  if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'Color must be a valid hex color code (e.g., #FF0000)' },
    });
    return;
  }

  try {
    const result = await warningLevelService.create({
      name: name.trim(),
      description: description || null,
      level,
      color: color || null,
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
  const { name, description, level, color } = req.body;

  if (level !== undefined && (typeof level !== 'number' || level < 0 || level > 100)) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'Level must be a number between 0 and 100' },
    });
    return;
  }

  if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      error: { message: 'Color must be a valid hex color code (e.g., #FF0000)' },
    });
    return;
  }

  try {
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;
    if (level !== undefined) updateData.level = level;
    if (color !== undefined) updateData.color = color;

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
    const success = await warningLevelService.delete_(id);

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
