import React, { FC } from 'react';

import SVGComponentProps from '@/components/images/svg-component-props';

const TableIconFile: FC<SVGComponentProps> = ({ className = '' }) => {
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
        d="M9.33332 1.33325V3.99992C9.33332 4.35354 9.4738 4.69268 9.72385 4.94273C9.9739 5.19278 10.313 5.33325 10.6667 5.33325H13.3333M9.99999 1.33325H3.99999C3.64637 1.33325 3.30723 1.47373 3.05718 1.72378C2.80713 1.97382 2.66666 2.31296 2.66666 2.66659V13.3333C2.66666 13.6869 2.80713 14.026 3.05718 14.2761C3.30723 14.5261 3.64637 14.6666 3.99999 14.6666H12C12.3536 14.6666 12.6928 14.5261 12.9428 14.2761C13.1928 14.026 13.3333 13.6869 13.3333 13.3333V4.66659L9.99999 1.33325Z"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default React.memo(TableIconFile);
