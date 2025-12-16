import React, { FC } from 'react';
import TableIconDelete from '@/components/images/TableIconDelete';

type DeleteButtonProps = {
  onClick: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
};

const DeleteButton: FC<DeleteButtonProps> = ({ 
  onClick, 
  title = 'Delete',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'p-1 w-7 h-7',
    md: 'p-1 w-8 h-8',
    lg: 'p-2 w-10 h-10'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        inline-flex items-center justify-center rounded-full
        text-red-600 hover:text-red-800 hover:bg-red-50
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <TableIconDelete className={`stroke-current w-${iconSizes[size]} h-${iconSizes[size]}`} />
    </button>
  );
};

export default DeleteButton;
