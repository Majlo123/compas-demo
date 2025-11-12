import React, { FC } from 'react';

import SVGComponentProps from '@/components/images/svg-component-props';

const TableIconArrows: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="inherit"
    >
      <path
        d="M14 10.6667L11.3333 13.3334M11.3333 13.3334L8.66667 10.6667M11.3333 13.3334V2.66675M2 5.33341L4.66667 2.66675M4.66667 2.66675L7.33333 5.33341M4.66667 2.66675V13.3334"
        stroke="inherit"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default React.memo(TableIconArrows);
