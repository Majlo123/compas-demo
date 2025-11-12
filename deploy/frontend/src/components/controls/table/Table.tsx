import { FC } from 'react';

import TableColumnSort from '@/components/controls/table/TableColumnSort';
import classNameBuilder from '@/utils/classNameBuilder';

export type Row = {
  _id: string;
  [key: string]: any;
};

export type Column = {
  accessor: keyof Row;
  header: string;
  formatter?: (value: Row[keyof Row], row: Row) => React.ReactNode;
  width?: number;
  sortKey?: string;
};

type TableProps = {
  className?: string;
  rowHeight?: number;
  columns: Column[];
  data: Row[];
};

const DEFAULT_ROW_HEIGHT = 46;
const DEFAULT_HEADER_HEIGHT = 46;

const Table: FC<TableProps> = ({
  className,
  columns,
  data,
  rowHeight = DEFAULT_ROW_HEIGHT,
}) => {
  return (
    <div
      className={classNameBuilder(
        className,
        'acutro-table-outer-wrapper',
        'relative'
      )}
    >
      {/* Canvas */}
      <div
        className={classNameBuilder(
          'acutro-table-canvas',
          'absolute inset-0 overflow-x-auto'
        )}
      >
        {/* Table */}
        <div
          className={classNameBuilder(
            'acutro-table',
            'flex flex-col min-w-max w-full h-full',
            'bg-white rounded-t-lg overflow-hidden'
          )}
        >
          {/* Header */}
          <div
            className={classNameBuilder(
              'acutro-table-header',
              'flex ',
              'bg-ghostWhite'
            )}
            style={{
              height: `${DEFAULT_HEADER_HEIGHT}px`,
              minHeight: `${DEFAULT_HEADER_HEIGHT}px`,
            }}
          >
            {columns.map((col) => (
              <div
                key={String(col.accessor)}
                className={classNameBuilder(
                  'acutro-table-header-cell',
                  'h-full flex items-center justify-center'
                )}
                style={{ width: col.width }}
              >
                <div
                  className={classNameBuilder(
                    'acutro-table-header-cell-inner',
                    'overflow-hidden w-[calc(100%-2*20px)] h-[calc(100%-2*8px)] flex justify-start items-center'
                  )}
                >
                  <span className="whitespace-nowrap text-darkGrey text-h4 !font-bold">
                    {col.header}
                  </span>
                  {Boolean(col.sortKey) && (
                    <TableColumnSort sortKey={col.sortKey} />
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Body */}
          <div
            className={classNameBuilder(
              'acutro-table-body',
              'flex flex-col bg-white overflow-y-auto max-h-[100%]'
            )}
          >
            {data.map((row) => (
              <div
                key={row._id}
                className={classNameBuilder(
                  'acutro-table-row',
                  'flex border-b last-of-type:border-none border-grey hover:bg-grey95'
                )}
                style={{
                  height: `${rowHeight}px`,
                  minHeight: `${rowHeight}px`,
                }}
              >
                {columns.map((col) => {
                  const value = row[col.accessor];
                  return (
                    <div
                      key={String(col.accessor)}
                      className={classNameBuilder(
                        'acutro-table-cell-outer',
                        'h-full flex items-center justify-center'
                      )}
                      style={{ width: col.width }}
                    >
                      <div
                        className={classNameBuilder(
                          'acutro-table-cell-inner',
                          'overflow-hidden w-[calc(100%-2*20px)] h-[calc(100%-2*4px)] flex justify-start items-center'
                        )}
                      >
                        {col.formatter ? col.formatter(value, row) : value}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Footer */}
          <div
            className={classNameBuilder(
              'acutro-table-footer',
              'min-h-[15px] w-full'
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
