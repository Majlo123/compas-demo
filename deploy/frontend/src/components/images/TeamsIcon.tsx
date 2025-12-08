import React, { FC } from 'react';

import SVGComponentProps from '@/components/images/svg-component-props';

const TeamsIcon: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="inherit"
    >
      <path
        d="M13.3333 5.83333C13.3333 7.21405 12.2141 8.33333 10.8333 8.33333C9.45262 8.33333 8.33333 7.21405 8.33333 5.83333C8.33333 4.45262 9.45262 3.33333 10.8333 3.33333C12.2141 3.33333 13.3333 4.45262 13.3333 5.83333Z"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.8333 10.8333C12.6744 10.8333 14.4401 11.5648 15.7216 12.8651C17.0032 14.1654 17.7083 15.9348 17.7083 17.7917"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.95833 17.7917C3.95833 15.9348 4.66339 14.1654 5.94493 12.8651C7.22648 11.5648 8.99223 10.8333 10.8333 10.8333"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 6.66667C6.25 7.58714 5.50381 8.33333 4.58333 8.33333C3.66286 8.33333 2.91667 7.58714 2.91667 6.66667C2.91667 5.74619 3.66286 5 4.58333 5C5.50381 5 6.25 5.74619 6.25 6.66667Z"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.91667 11.25C7.28647 10.8473 6.57862 10.5799 5.83333 10.4667C5.08805 10.3535 4.32692 10.3972 3.59961 10.595C2.8723 10.7929 2.19489 11.1405 1.61498 11.6152C1.03508 12.09 0.564859 12.6813 0.229166 13.3502"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default React.memo(TeamsIcon);
