import httpStatus from 'http-status';
import { organizationRepository } from 'repos/index';
import { CreateOrganization, Organization } from 'repos/organization.model';
import { PaginatedResult } from 'repos/utils/pagination';
import QueryParams from 'repos/utils/query/QueryParams';
import ApiError from 'shared/error/ApiError';

export const create = async (entity: CreateOrganization): Promise<Organization> => {
  return organizationRepository.create(entity);
};

export const findById = async (id: string): Promise<Organization> => {
  const entity = await organizationRepository.findById({ id });
  if (!entity) {
    throw new ApiError(`Organization with id ${id} not found`, httpStatus.NOT_FOUND);
  }
  return entity;
};

export const findAll = async (query: QueryParams): Promise<PaginatedResult<Organization>> => {
  return organizationRepository.findAll({ queryParams: query });
};

export const updateById = async (
  id: string,
  entity: Partial<CreateOrganization>,
): Promise<Organization> => {
  const updated = await organizationRepository.updateById(id, entity);
  if (!updated) {
    throw new ApiError(`Cannot update. Organization with id ${id} not found`, httpStatus.NOT_FOUND);
  }
  return updated;
};

export const deleteById = async (id: string): Promise<Organization> => {
  const deleted = await organizationRepository.deleteById(id);
  if (!deleted) {
    throw new ApiError(`Cannot delete. Organization with id ${id} not found`, httpStatus.NOT_FOUND);
  }
  return deleted;
};
