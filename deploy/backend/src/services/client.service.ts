import httpStatus from 'http-status';
import { clientRepository } from 'repos/index';
import { Client as ClientModel, CreateClient } from 'repos/client.model';
import QueryParams from 'repos/utils/query/QueryParams';
import { PaginatedResult } from 'repos/utils/pagination';
import ApiError from 'shared/error/ApiError';

export type Client = {
  id: string;
  name: string;
  hourlyRate: number;
  projectCount?: number;
};

export const listClients = async (query: QueryParams): Promise<PaginatedResult<Client>> => {
  const result = await clientRepository.findAll({ queryParams: query });
  return {
    ...result,
    data: result.data.map(mapClientModelToClient),
  };
};

export const getClientById = async (id: string): Promise<Client> => {
  const client = await clientRepository.findById({ id });
  if (!client) {
    throw new ApiError('Client not found', httpStatus.NOT_FOUND);
  }
  return mapClientModelToClient(client);
};

export const createClient = async (data: { name: string; hourlyRate: number }): Promise<Client> => {
  const exists = await clientRepository.findByField('name', data.name);
  if (exists) {
    throw new ApiError('Client with this name already exists', httpStatus.CONFLICT);
  }
  const created = await clientRepository.create({
    name: data.name,
    hourlyRate: data.hourlyRate,
  } as CreateClient);
  return mapClientModelToClient(created);
};

export const updateClient = async (id: string, data: { name: string; hourlyRate: number }): Promise<Client> => {
  const client = await clientRepository.findById({ id });
  if (!client) {
    throw new ApiError('Client not found', httpStatus.NOT_FOUND);
  }
  const updated = await clientRepository.updateById(id, {
    name: data.name,
    hourlyRate: data.hourlyRate,
  } as Partial<ClientModel>);
  if (!updated) {
    throw new ApiError('Failed to update client', httpStatus.INTERNAL_SERVER_ERROR);
  }
  return mapClientModelToClient(updated);
};

export const listClientProjects = async (id: string) => {
  const client = await clientRepository.findById({ id });
  if (!client) {
    throw new ApiError('Client not found', httpStatus.NOT_FOUND);
  }
  // Placeholder: teams are linked to clients via client_id
  return [] as any[];
};

const mapClientModelToClient = (model: ClientModel): Client => ({
  id: model.id!,
  name: model.name,
  hourlyRate: model.hourlyRate,
  projectCount: 0, // Can be calculated from teams/projects if needed
});
