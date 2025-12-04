import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

import TableColumnSort from '@/components/controls/table/TableColumnSort';

export type Row = {
  _id: string;
  [key: string]: any;
};

export type Column = {
  accessor: keyof Row;
  header: string;
  formatter?: (value: Row[keyof Row], row: Row) => React.ReactNode;
  sortKey?: string;
};

type TableProps = {
  className?: string;
  columns: Column[];
  data: Row[];

  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  tableClassName?: string;
  headerCellClassName?: string;
};

const Table: FC<TableProps> = ({
  className,
  columns,
  data,
  headerClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  tableClassName,
  headerCellClassName,
}) => {
  return (
    <div className={twMerge('relative w-full overflow-hidden', className)}>
      {/* Canvas */}
      <div className="w-full overflow-x-auto">
        {/* Table */}
        <div className={twMerge('flex flex-col w-full bg-white rounded-lg overflow-hidden mb-4', tableClassName)}>
          {/* Header */}
          <div className={twMerge('flex bg-gray-50 border-b border-gray-200', headerClassName)}>
            {columns.map((col) => (
              <div
                key={String(col.accessor)}
                className={twMerge('flex-1 flex items-center px-5 py-5', headerCellClassName)}
              >
                <span className="whitespace-nowrap text-gray-600">
                  {col.header}
                </span>
                {Boolean(col.sortKey) && (
                  <TableColumnSort sortKey={col.sortKey} />
                )}
              </div>
            ))}
          </div>
          {/* Body */}
          <div className={twMerge('flex flex-col bg-white', bodyClassName)}>
            {data.map((rowData) => (
              <div
                key={rowData._id}
                className={twMerge('flex border-b last-of-type:border-none border-gray-100 hover:bg-gray-50 transition-colors', rowClassName)}
              >
                {columns.map((col) => {
                  const value = rowData[col.accessor];
                  return (
                    <div
                      key={String(col.accessor)}
                      className={twMerge('flex-1 flex items-center px-5 py-3', cellClassName)}
                    >
                      {col.formatter ? col.formatter(value, rowData) : value}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

