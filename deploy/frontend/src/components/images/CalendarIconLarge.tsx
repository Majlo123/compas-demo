import React, { FC } from 'react';

import SVGComponentProps from '@/components/images/svg-component-props';

const CalendarIconLarge: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 4V12M32 4V12M6 20H42M10 8H38C40.2091 8 42 9.79086 42 12V40C42 42.2091 40.2091 44 38 44H10C7.79086 44 6 42.2091 6 40V12C6 9.79086 7.79086 8 10 8Z"
        stroke="#1E88E5"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="14" y="26" width="4" height="4" rx="1" fill="#1E88E5" />
      <rect x="22" y="26" width="4" height="4" rx="1" fill="#1E88E5" />
      <rect x="30" y="26" width="4" height="4" rx="1" fill="#1E88E5" />
      <rect x="14" y="34" width="4" height="4" rx="1" fill="#1E88E5" />
      <rect x="22" y="34" width="4" height="4" rx="1" fill="#1E88E5" />
    </svg>
  );
};

export default React.memo(CalendarIconLarge);