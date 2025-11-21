import React, { FC } from 'react';

import SVGComponentProps from '@/components/images/svg-component-props';

const BadgeIconThickCircle: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className={`bi bi-badge-thick-circle ${className}`}
      viewBox="0 0 16 16"
    >
      {/* Thick circle */}
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Text inside circle */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="5"
        fontWeight="bold"
        fill="currentColor"
      >
        SWG
      </text>
    </svg>
  );
};

export default React.memo(BadgeIconThickCircle);