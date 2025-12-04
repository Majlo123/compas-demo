import React from 'react';
import Dropdown from '@/components/controls/Dropdown';

export interface Notification {
  id: string;
  title: string;
  timestamp: Date;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  notifications: Notification[];
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  notifications,
  onClose,
}) => {
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!isOpen) return null;

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} className="w-80 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => {
                // Handle notification click
                onClose();
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 break-words">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-2">
          <button className="w-full text-center text-xs font-medium text-primary hover:text-primary/80 py-2 transition-colors">
            View All Notifications
          </button>
        </div>
      )}
    </Dropdown>
  );
};

export default NotificationsDropdown;
