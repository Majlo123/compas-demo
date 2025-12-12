import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { clientService } from 'services';
import catchAsync from 'shared/utils/CatchAsync';

export const listClients = catchAsync(async (req: Request, res: Response) => {
  const result = await clientService.listClients(req.queryParams);
  res.status(httpStatus.OK).send({ success: true, content: result });
});

export const getClient = catchAsync(async (req: Request, res: Response) => {
  const client = await clientService.getClientById(req.params.id);
  res.status(httpStatus.OK).send({ success: true, content: client });
});

export const createClient = catchAsync(async (req: Request, res: Response) => {
  const created = await clientService.createClient(req.body);
  res.status(httpStatus.CREATED).send({ success: true, message: 'Client created', content: created });
});

export const updateClient = catchAsync(async (req: Request, res: Response) => {
  const updated = await clientService.updateClient(req.params.id, req.body);
  res.status(httpStatus.OK).send({ success: true, message: 'Client updated', content: updated });
});

export const listClientProjects = catchAsync(async (req: Request, res: Response) => {
  const projects = await clientService.listClientProjects(req.params.id);
  res.status(httpStatus.OK).send({ success: true, content: { data: projects } });
});
