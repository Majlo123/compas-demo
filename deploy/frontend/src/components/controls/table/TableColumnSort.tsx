import { FC } from 'react';

import TableIconSort from '@/components/images/TableIconSort';
import TableIconSortDown from '@/components/images/TableIconSortDown';
import TableIconSortUp from '@/components/images/TableIconSortUp';
import useSort from '@/hooks/useSort';
import { SORT_DIRECTION } from '@/types/query/QuerySort';

interface TableSortByProps {
  sortKey: string;
}

const TableColumnSort: FC<TableSortByProps> = ({ sortKey }) => {
  const { sort, setSort } = useSort();

  const isUsed = sort.by === sortKey;
  const direction = isUsed ? sort.direction : null;

  const onClick = (): void => {
    setSort(sortKey);
  };
  return (
    <button className="flex justify-center items-center ml-2" onClick={onClick}>
      {direction === SORT_DIRECTION.ASC && (
        <TableIconSortUp className="stroke-darkGrey" />
      )}
      {direction === SORT_DIRECTION.DESC && (
        <TableIconSortDown className="stroke-darkGrey" />
      )}
      {!direction && <TableIconSort className="stroke-darkBlue" />}
    </button>
  );
};

export default TableColumnSort;
