import React, { FC } from 'react';

import SVGComponentProps from '@/components/images/svg-component-props';

const TableIconSortDown: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="inherit"
    >
      <path
        d="M 14 10.667 L 11.333 13.333 M 11.333 13.333 L 8.667 10.667 M 11.333 13.333 L 11.333 2.667"
        stroke="inherit"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default React.memo(TableIconSortDown);
