import React, { FC } from 'react';
import SVGComponentProps from '@/components/images/svg-component-props';

const CheckCircleIcon: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default React.memo(CheckCircleIcon);
