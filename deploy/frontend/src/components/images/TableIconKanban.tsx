import React, { FC } from 'react';

import SVGComponentProps from '@/components/images/svg-component-props';

const TableIconKanban: FC<SVGComponentProps> = ({ className = '' }) => {
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
        d="M3.33334 2V11.3333M8.00001 2V7.33333M12.6667 2V14"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default React.memo(TableIconKanban);
