export const FILTER_OPERATORS = {
  CONTAINS: 'contains',
  EQUALS: 'equals',
  LESS_THAN: 'lessThan',
  GREATER_THAN: 'greaterThan',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
} as const;

export type FilterOperator =
  (typeof FILTER_OPERATORS)[keyof typeof FILTER_OPERATORS];

type OperatorValueMap = {
  contains: string;
  equals: string | number | boolean;
  lessThan: number;
  greaterThan: number;
  startsWith: string;
  endsWith: string;
};

type QueryFilter = {
  [K in FilterOperator]: {
    filterKey: string;
    operator: K;
    value: OperatorValueMap[K];
  };
}[FilterOperator];

export default QueryFilter;
