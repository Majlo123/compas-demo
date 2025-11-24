import React, { FC } from 'react';
import SVGComponentProps from '@/components/images/svg-component-props';

const BadgeIconCheckCircle: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      {/* Circle */}
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />

      {/* Approve Check */}
      <path
        d="M5 8 L7 10.2 L11 5.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default React.memo(BadgeIconCheckCircle);
