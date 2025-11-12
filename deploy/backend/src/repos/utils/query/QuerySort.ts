export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

type QuerySort = {
  by: string;
  direction: (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];
};
export default QuerySort;
