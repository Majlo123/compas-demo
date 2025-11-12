import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { organizationService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';

export const findById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const organization = await organizationService.findById(id);

  res.status(httpStatus.OK).send({
    success: true,
    content: { organization },
  });
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const newOrganization = await organizationService.create(req.body);

  res.status(httpStatus.CREATED).send({
    success: true,
    content: { organization: newOrganization },
  });
});

export const findAll = catchAsync(async (req: Request, res: Response) => {
  const paginatedResult = await organizationService.findAll(req.queryParams);

  res.status(httpStatus.OK).send({
    success: true,
    content: { paginatedResult },
  });
});

export const updateById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedOrganization = await organizationService.updateById(id, req.body);

  res.status(httpStatus.OK).send({
    success: true,
    content: { organization: updatedOrganization },
  });
});

export const deleteById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedOrganization = await organizationService.deleteById(id);

  res.status(httpStatus.OK).send({
    success: true,
    content: { organization: deletedOrganization },
  });
});
