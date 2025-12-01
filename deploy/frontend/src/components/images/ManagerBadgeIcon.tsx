import React, { FC } from 'react';
import SVGComponentProps from '@/components/images/svg-component-props';

const ManagerBadgeIcon: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {/* Star/Medal shape */}
      <path
        d="M10 2 L11.5 7 L17 7.5 L13 11.5 L14.5 17 L10 14 L5.5 17 L7 11.5 L3 7.5 L8.5 7 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ManagerBadgeIcon;
