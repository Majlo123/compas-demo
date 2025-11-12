import { PaginatedResult } from 'repos/utils/pagination';
import PopulateOption from 'repos/utils/populateOption';
import QueryParams from 'repos/utils/query/QueryParams';

/**
 * Base repository factory defining standard CRUD operation signatures.
 *
 * ⚠️ Note: Function signatures and implementations will likely need to change
 * depending on the database technology in use.
 */

type FindByIdRequest = {
  id: string;
  options?: PopulateOption;
};

type FindAllRequest = {
  queryParams: QueryParams;
  options?: PopulateOption;
};

export type BaseRepositoryResult<F> = {
  create: (entity: Partial<F>) => Promise<F>;
  findById: (request: FindByIdRequest) => Promise<F | null>;
  findAll: (request: FindAllRequest) => Promise<PaginatedResult<F>>;
  updateById: (id: string, entity: Partial<F>) => Promise<F | null>;
  deleteById: (id: string) => Promise<F | null>;
  findByField: (fieldName: string, value: any) => Promise<F | null>;
};

const createBaseRepository = <F>(): BaseRepositoryResult<F> => {
  const notImplemented = (method: string): never => {
    throw new Error(`Method "${method}" not implemented in base repository.`);
  };

  return {
    create: async () => notImplemented('create'),
    findById: async () => notImplemented('findById'),
    findAll: async () => notImplemented('findAll'),
    updateById: async () => notImplemented('updateById'),
    deleteById: async () => notImplemented('deleteById'),
    findByField: async () => notImplemented('findByField'),
  };
};

export default createBaseRepository;
