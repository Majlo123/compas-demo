import React, { FC } from 'react';
import SVGComponentProps from '@/components/images/svg-component-props';

const InputIconDate: FC<SVGComponentProps> = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className={`bi bi-calendar ${className}`}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 0a.5.5 0 0 0-.5.5V1H2.5A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h11A1.5 1.5 0 0 0 15 13.5v-11A1.5 1.5 0 0 0 13.5 1H13v-.5a.5.5 0 0 0-1 0V1H4v-.5a.5.5 0 0 0-.5-.5zM2 6h12v7.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V6z" />
    </svg>
  );
};

export default React.memo(InputIconDate);
