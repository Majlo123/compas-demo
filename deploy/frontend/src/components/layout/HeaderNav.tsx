import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BellIcon from '@/components/images/BellIcon';
import NotificationBadge from '@/components/controls/NotificationBadge';
import Dropdown from '@/components/controls/Dropdown';
import NotificationsDropdown, { type Notification } from '@/components/layout/NotificationsDropdown';
import { useAuthStore } from '@/stores/useAuthStore';
import { getFromLocalStorage } from '@/services/local.storage';
import { initializeSocket, onNotification, offNotification, onNotificationUpdate, offNotificationUpdate, onNotificationDelete, offNotificationDelete } from '@/services/socket.service';
import {
  fetchUnreadNotifications,
  type LeaveRequestNotification,
} from '@/api/notification.actions';
import { isApiSuccess } from '@/api/shared.types';

const HeaderNav: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Fetch notifications on mount
  useEffect(() => {
    const loadNotifications = async () => {
      const response = await fetchUnreadNotifications();
      if (isApiSuccess(response)) {
        const notifs: Notification[] = response.content.map(
          (n: LeaveRequestNotification) => ({
            id: n.id,
            title: n.title,
            timestamp: new Date(n.createdAt),
            leaveRequestId: n.leaveRequestId,
          }),
        );
        setNotifications(notifs);
        setUnreadNotificationCount(notifs.length);
      }
    };

    loadNotifications();
  }, []);

  // Initialize socket and listen for new notifications
  useEffect(() => {
    // Only initialize if we have a token
    const token = getFromLocalStorage('token');
    console.log('Socket initialization useEffect triggered, token exists:', !!token);
    if (!token) {
      console.log('No token found, skipping socket initialization');
      return;
    }

    try {
      console.log('Calling initializeSocket');
      initializeSocket();

      const handleNewNotification = (notification: LeaveRequestNotification) => {
        console.log('New notification received:', notification);
        const newNotif: Notification = {
          id: notification.id,
          title: notification.title,
          timestamp: new Date(notification.createdAt),
          leaveRequestId: notification.leaveRequestId,
        };

        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadNotificationCount((prev) => prev + 1);
      };

      const handleNotificationUpdate = (notification: LeaveRequestNotification) => {
        console.log('Notification updated:', notification);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id
              ? {
                  ...n,
                  title: notification.title,
                  timestamp: new Date(notification.createdAt),
                }
              : n
          )
        );
      };

      const handleNotificationDelete = (data: { id: string }) => {
        console.log('Notification deleted:', data.id);
        setNotifications((prev) => prev.filter((n) => n.id !== data.id));
        setUnreadNotificationCount((prev) => Math.max(0, prev - 1));
      };

      onNotification(handleNewNotification);
      onNotificationUpdate(handleNotificationUpdate);
      onNotificationDelete(handleNotificationDelete);

      return () => {
        offNotification(handleNewNotification);
        offNotificationUpdate(handleNotificationUpdate);
        offNotificationDelete(handleNotificationDelete);
      };
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const getUserInitials = (): string => {
    const userString = getFromLocalStorage('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        const names = user.fullName?.split(' ') || [];
        if (names.length >= 2) {
          return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return user.fullName?.[0]?.toUpperCase() || 'U';
      } catch {
        return 'U';
      }
    }
    return 'U';
  };

  const getUserInfo = (): { fullName: string; email: string } | null => {
    const userString = getFromLocalStorage('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        return {
          fullName: user.fullName || 'User',
          email: user.email || '',
        };
      } catch {
        return null;
      }
    }
    return null;
  };

  const userInfo = getUserInfo();

  const handleNotificationRead = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    setUnreadNotificationCount((prev) => Math.max(0, prev - 1));
  };

  const handleAllNotificationsRead = () => {
    setNotifications([]);
    setUnreadNotificationCount(0);
  };

  return (
    <header className="bg-headerBg border-b border-2 border-headerBorder flex items-center justify-between px-4 py-2 sticky top-0 z-50">
      {/* Organization Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">2C</span>
          </div>
          <span className="font-medium text-gray-800">2C Solution</span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <NotificationBadge count={unreadNotificationCount}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5 stroke-gray-600" />
            </button>
          </NotificationBadge>
          <NotificationsDropdown
            isOpen={isNotificationsOpen}
            notifications={notifications}
            onClose={() => setIsNotificationsOpen(false)}
            onNotificationRead={handleNotificationRead}
            onAllRead={handleAllNotificationsRead}
          />
        </div>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
              {getUserInitials()}
            </div>
          </button>
          
          {/* Dropdown menu */}
          <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} className="w-56">
            {/* User Info Header */}
            {userInfo && (
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="font-medium text-gray-800 truncate">{userInfo.fullName}</div>
                <div className="text-sm text-gray-600 truncate">{userInfo.email}</div>
              </div>
            )}
            
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Log out
              </button>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
