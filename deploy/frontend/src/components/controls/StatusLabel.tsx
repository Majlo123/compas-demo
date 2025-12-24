import React from 'react';
import { twMerge } from 'tailwind-merge';

export const statusStyles = {
  OK: 'text-status-ok bg-status-okBg',
  TRIGGERED: 'text-status-triggered bg-status-triggeredBg',
} as const;

export type StatusType = keyof typeof statusStyles;

interface StatusLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  className?: string;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({
  status,
  className,
  ...props
}) => {
  const styles = statusStyles[status];

  return (
    <span
      className={twMerge(
        'inline-flex items-center justify-center px-2 py-1 rounded-xl text-xs font-bold uppercase',
        styles,
        className
      )}
      {...props}
    >
      {status}
    </span>
  );
};
