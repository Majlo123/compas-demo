import QueryFilter from 'repos/utils/query/QueryFilters';
import QueryPagination from 'repos/utils/query/QueryPagination';
import QuerySort from 'repos/utils/query/QuerySort';

type QueryParams = {
  pagination?: QueryPagination;
  sort?: QuerySort;
  filters?: QueryFilter[];
};

export default QueryParams;
