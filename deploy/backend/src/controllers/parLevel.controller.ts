import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as parLevelService from 'services/parLevel.service';
import catchAsync from 'shared/utils/CatchAsync';
import ApiError from 'shared/error/ApiError';

export const getAllParLevels = catchAsync(async (req: Request, res: Response) => {
  const result = await parLevelService.findAll();
  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const getParLevelByProdId = catchAsync(async (req: Request, res: Response) => {
  const { prodId } = req.params;
  const result = await parLevelService.findByProdId(prodId);

  if (!result) {
    throw new ApiError('PAR level not found for this product', httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const getParLevelsByWarningLevel = catchAsync(async (req: Request, res: Response) => {
  const { warningLevelId } = req.params;
  const result = await parLevelService.findByWarningLevelId(warningLevelId);

  res.status(httpStatus.OK).send({
    success: true,
    content: result,
  });
});

export const createParLevel = catchAsync(async (req: Request, res: Response) => {
  const { prodId, threshold, warningLevelId } = req.body;

  if (!prodId || threshold === undefined || !warningLevelId) {
    throw new ApiError(
      'prodId, threshold, and warningLevelId are required',
      httpStatus.BAD_REQUEST,
    );
  }

  const result = await parLevelService.create({
    prodId,
    threshold,
    warningLevelId,
  });

  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'PAR level created successfully',
    content: result,
  });
});

export const updateParLevel = catchAsync(async (req: Request, res: Response) => {
  const { prodId } = req.params;
  const { threshold, warningLevelId } = req.body;

  if (threshold === undefined && !warningLevelId) {
    throw new ApiError(
      'At least one of threshold or warningLevelId is required',
      httpStatus.BAD_REQUEST,
    );
  }

  const result = await parLevelService.update(prodId, {
    threshold,
    warningLevelId,
  });

  res.status(httpStatus.OK).send({
    success: true,
    message: 'PAR level updated successfully',
    content: result,
  });
});

export const deleteParLevel = catchAsync(async (req: Request, res: Response) => {
  const { prodId } = req.params;

  const result = await parLevelService.deleteByProdId(prodId);

  if (!result) {
    throw new ApiError('Failed to delete PAR level', httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).send({
    success: true,
    message: 'PAR level deleted successfully',
  });
});
