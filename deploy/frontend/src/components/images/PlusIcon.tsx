import React, { FC } from 'react';
import SVGComponentProps from '@/components/images/svg-component-props';

const PlusIcon: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 5V19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 12H19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default React.memo(PlusIcon);
