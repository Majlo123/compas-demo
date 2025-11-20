import React, { FC } from 'react';
import SVGComponentProps from '@/components/images/svg-component-props';

const SettingsIcon: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 1V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 21V23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.22 4.22L5.64 5.64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.36 18.36L19.78 19.78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 12H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12H23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.22 19.78L5.64 18.36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.36 5.64L19.78 4.22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default React.memo(SettingsIcon);
