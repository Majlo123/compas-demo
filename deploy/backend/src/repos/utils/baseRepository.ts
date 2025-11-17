import pool from 'config/database';
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

const createBaseRepository = <F>(tableName: string): BaseRepositoryResult<F> => {
  const toCamelCase = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  };

  const toSnakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  };

  // Convert DB row to entity (snake_case -> camelCase)
  const rowToEntity = (row: any): F => {
    const entity: any = {};
    Object.keys(row).forEach((key) => {
      entity[toCamelCase(key)] = row[key];
    });
    return entity as F;
  };

  // Convert entity to DB row (camelCase -> snake_case)
  const entityToRow = (entity: Partial<F>): any => {
    const row: any = {};
    Object.keys(entity).forEach((key) => {
      row[toSnakeCase(key)] = (entity as any)[key];
    });
    return row;
  };

  return {
    create: async (entity: Partial<F>): Promise<F> => {
      const row = entityToRow(entity);
      const columns = Object.keys(row);
      const values = Object.values(row);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `
        INSERT INTO ${tableName} (${columns.join(', ')})
        VALUES (${placeholders})
        RETURNING *
      `;
      
      const result = await pool.query(query, values);
      return rowToEntity(result.rows[0]);
    },

    findById: async ({ id }: FindByIdRequest): Promise<F | null> => {
      const query = `SELECT * FROM ${tableName} WHERE id = $1`;
      const result = await pool.query(query, [id]);
      return result.rows[0] ? rowToEntity(result.rows[0]) : null;
    },

    findAll: async ({ queryParams }: FindAllRequest): Promise<PaginatedResult<F>> => {
      const page = queryParams.pagination?.page || 1;
      const pageSize = queryParams.pagination?.pageSize || 10;
      const offset = (page - 1) * pageSize;

      const countQuery = `SELECT COUNT(*) FROM ${tableName}`;
      const dataQuery = `SELECT * FROM ${tableName} LIMIT $1 OFFSET $2`;

      const [countResult, dataResult] = await Promise.all([
        pool.query(countQuery),
        pool.query(dataQuery, [pageSize, offset]),
      ]);

      const totalItems = parseInt(countResult.rows[0].count, 10);
      const data = dataResult.rows.map(rowToEntity);

      return {
        data,
        totalItems,
        page,
        pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
      };
    },

    updateById: async (id: string, entity: Partial<F>): Promise<F | null> => {
      const row = entityToRow(entity);
      const columns = Object.keys(row);
      const values = Object.values(row);
      const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');
      
      const query = `
        UPDATE ${tableName}
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [id, ...values]);
      return result.rows[0] ? rowToEntity(result.rows[0]) : null;
    },

    deleteById: async (id: string): Promise<F | null> => {
      const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, [id]);
      return result.rows[0] ? rowToEntity(result.rows[0]) : null;
    },

    findByField: async (fieldName: string, value: any): Promise<F | null> => {
      const snakeFieldName = toSnakeCase(fieldName);
      const query = `SELECT * FROM ${tableName} WHERE ${snakeFieldName} = $1`;
      const result = await pool.query(query, [value]);
      return result.rows[0] ? rowToEntity(result.rows[0]) : null;
    },
  };
};

export default createBaseRepository;

