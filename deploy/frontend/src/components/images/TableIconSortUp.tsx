import React, { FC } from 'react';

import SVGComponentProps from '@/components/images/svg-component-props';

const TableIconSortUp: FC<SVGComponentProps> = ({ className = '' }) => {
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
        d="M 2 5.333 L 4.667 2.667 M 4.667 2.667 L 7.333 5.333 M 4.667 2.667 L 4.667 13.333"
        stroke="inherit"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default React.memo(TableIconSortUp);
