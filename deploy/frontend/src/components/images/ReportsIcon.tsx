import React, { FC } from 'react';
import SVGComponentProps from '@/components/images/svg-component-props';

const ReportsIcon: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 10H16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 14H16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 18H12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default React.memo(ReportsIcon);
