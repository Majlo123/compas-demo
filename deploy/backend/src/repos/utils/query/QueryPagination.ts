export const PAGE_SIZES = [10, 20, 50, 100] as const;

type QueryPagination = {
  page: number;
  pageSize: (typeof PAGE_SIZES)[number];
};

export default QueryPagination;
