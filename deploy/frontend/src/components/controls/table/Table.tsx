import { FC } from 'react';
import { tv } from 'tailwind-variants';

import TableColumnSort from '@/components/controls/table/TableColumnSort';

export type Row = {
  _id: string;
  [key: string]: any;
};

export type Column = {
  accessor: keyof Row;
  header: string;
  formatter?: (value: Row[keyof Row], row: Row) => React.ReactNode;
  width?: number | string;
  sortKey?: string;
};

type TableProps = {
  className?: string;
  rowHeight?: number;
  headerHeight?: number;
  columns: Column[];
  data: Row[];

  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  tableClassName?: string;
};

const DEFAULT_ROW_HEIGHT = 46;
const DEFAULT_HEADER_HEIGHT = 46;

const tableVariants = tv({
  slots: {
    wrapper: 'relative w-full overflow-hidden',
    canvas: 'w-full overflow-x-auto',
    table: 'flex flex-col w-full bg-white rounded-lg overflow-hidden',
    header: 'flex bg-gray-50 border-b border-gray-200',
    headerCell: 'h-full flex items-center justify-center',
    headerCellInner: 'overflow-hidden w-[calc(100%-2*20px)] h-[calc(100%-2*8px)] flex justify-start items-center',
    headerText: 'whitespace-nowrap text-gray-600',
    body: 'flex flex-col bg-white',
    row: 'flex border-b last-of-type:border-none border-gray-100 hover:bg-gray-50 transition-colors',
    cellOuter: 'h-full flex items-center justify-center',
    cellInner: 'overflow-hidden w-[calc(100%-2*20px)] h-[calc(100%-2*4px)] flex justify-start items-center',
    footer: 'min-h-[15px] w-full',
  },
});

const { wrapper, canvas, table, header, headerCell, headerCellInner, headerText, body, row, cellOuter, cellInner, footer } = tableVariants();

const Table: FC<TableProps> = ({
  className,
  columns,
  data,
  rowHeight = DEFAULT_ROW_HEIGHT,
  headerHeight = DEFAULT_HEADER_HEIGHT,
  headerClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  tableClassName,
}) => {
  return (
    <div className={wrapper({ className })}>
      {/* Canvas */}
      <div className={canvas()}>
        {/* Table */}
        <div className={table({ className: tableClassName })}>
          {/* Header */}
          <div
            className={header({ className: headerClassName })}
            style={{
              height: `${headerHeight}px`,
              minHeight: `${headerHeight}px`,
            }}
          >
            {columns.map((col) => (
              <div
                key={String(col.accessor)}
                className={headerCell({ className: cellClassName })}
                style={{ width: col.width }}
              >
                <div className={headerCellInner({ className: cellClassName })}>
                  <span className={headerText({ className: headerClassName })}>
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
          <div className={body({ className: bodyClassName })}>
            {data.map((rowData) => (
              <div
                key={rowData._id}
                className={row({ className: rowClassName })}
                style={{
                  height: `${rowHeight}px`,
                  minHeight: `${rowHeight}px`,
                }}
              >
                {columns.map((col) => {
                  const value = rowData[col.accessor];
                  return (
                    <div
                      key={String(col.accessor)}
                      className={cellOuter({ className: cellClassName })}
                      style={{ width: col.width }}
                    >
                      <div className={cellInner({ className: cellClassName })}>
                        {col.formatter ? col.formatter(value, rowData) : value}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className={footer()} />
        </div>
      </div>
    </div>
  );
};

export default Table;

