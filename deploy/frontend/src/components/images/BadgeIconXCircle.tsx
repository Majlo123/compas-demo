import React, { FC } from 'react';
import SVGComponentProps from '@/components/images/svg-component-props';

const BadgeIconXCircle: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M8 8 L16 16 M16 8 L8 16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default BadgeIconXCircle;
