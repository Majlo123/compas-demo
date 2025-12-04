import React from 'react';

interface NotificationBadgeProps {
  count: number;
  children: React.ReactNode;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, children }) => {
  return (
    <div className="relative inline-flex">
      {children}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-sick-leave rounded-full pointer-events-none">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;
