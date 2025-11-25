import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGE_SIZES } from 'repos/utils/query/QueryPagination';
import QueryParams from 'repos/utils/query/QueryParams';
import { SORT_DIRECTION } from 'repos/utils/query/QuerySort';
import ApiError from 'shared/error/ApiError';

const parseQueryParams = (req: Request, _res: Response, next: NextFunction): void => {
  const { query } = req;
  const queryParams: QueryParams = {};

  const page = query.page ? Number(query.page) : 1;
  const pageSize = query.pageSize ? Number(query.pageSize) : 20;

  if (query.page || query.pageSize) {
    if (Number.isNaN(page) || page < 1) {
      throw new ApiError(`Invalid "page" parameter: ${query.page}`, httpStatus.BAD_REQUEST);
    }

    if (Number.isNaN(pageSize) || !PAGE_SIZES.includes(pageSize as (typeof PAGE_SIZES)[number])) {
      throw new ApiError(`Invalid "pageSize" parameter: ${query.pageSize}`, httpStatus.BAD_REQUEST);
    }

    queryParams.pagination = { page, pageSize } as QueryParams['pagination'];
  }

  const hasSortBy = Boolean(query.by);
  const hasSortDir = Boolean(query.direction);
  if (hasSortBy && hasSortDir) {
    const by = typeof query.by === 'string' ? query.by.trim() : null;

    if (!by) {
      throw new ApiError(`Invalid "sortBy" parameter: ${by}`, httpStatus.BAD_REQUEST);
    }

    let direction: (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION] | null = null;

    if (typeof query.direction === 'string') {
      const isValidDirection = Object.values(SORT_DIRECTION).includes(
        query.direction as (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION],
      );
      if (isValidDirection) {
        direction = query.direction as (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];
      }
    }

    if (!direction) {
      throw new ApiError(`Invalid "sortDir" parameter: ${query.direction}`, httpStatus.BAD_REQUEST);
    }

    queryParams.sort = { by, direction } as QueryParams['sort'];
  }

  if (query.filter) {
    if (typeof query.filter !== 'string') {
      throw new ApiError('"filter" must be a string', httpStatus.BAD_REQUEST);
    }

    try {
      const decoded = decodeURIComponent(query.filter);
      const parsedFilters = JSON.parse(decoded);

      if (!Array.isArray(parsedFilters)) {
        throw new ApiError('"filter" must be a JSON array', httpStatus.BAD_REQUEST);
      }

      parsedFilters.forEach((filter, index) => {
        const validOperators = [
          'contains',
          'equals',
          'lessThan',
          'greaterThan',
          'startsWith',
          'endsWith',
        ];
        if (
          typeof filter !== 'object' ||
          typeof filter.filterKey !== 'string' ||
          typeof filter.operator !== 'string' ||
          !('value' in filter)
        ) {
          throw new ApiError(`Invalid filter at index ${index}`, httpStatus.BAD_REQUEST);
        }

        if (!validOperators.includes(filter.operator)) {
          throw new ApiError(
            `Invalid operator "${filter.operator}" in filter at index ${index}`,
            httpStatus.BAD_REQUEST,
          );
        }
      });

      queryParams.filters = parsedFilters;
    } catch (err) {
      throw new ApiError(`Invalid JSON in "filter": ${query.filter}`, httpStatus.BAD_REQUEST);
    }
  }
  req.queryParams = queryParams;

  next();
};

export default parseQueryParams;
