import QueryFilter from '@/types/query/QueryFilters';
import QueryPagination from '@/types/query/QueryPagination';
import QuerySort from '@/types/query/QuerySort';

type QueryParams = {
  pagination?: QueryPagination;
  sort?: QuerySort;
  filters?: QueryFilter[];
};

export default QueryParams;
