import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BellIcon from '@/components/images/BellIcon';
import NotificationBadge from '@/components/controls/NotificationBadge';
import Dropdown from '@/components/controls/Dropdown';
import NotificationsDropdown, { type Notification } from '@/components/layout/NotificationsDropdown';
import { useAuthStore } from '@/stores/useAuthStore';
import { getFromLocalStorage } from '@/services/local.storage';

const HeaderNav: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationCount] = useState(5); // Mock data - will fetch from API
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Sample notification data
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Your leave request for June 15-20 has been approved',
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    },
    {
      id: '2',
      title: 'John Smith requested approval for leave on July 10-15',
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    },
    {
      id: '3',
      title: 'Your leave request for August 1-5 was denied',
      timestamp: new Date(Date.now() - 1 * 86400000), // 1 day ago
    },
    {
      id: '4',
      title: 'Team meeting scheduled for tomorrow at 2 PM',
      timestamp: new Date(Date.now() - 2 * 86400000), // 2 days ago
    },
    {
      id: '5',
      title: 'Your profile has been updated successfully',
      timestamp: new Date(Date.now() - 3 * 86400000), // 3 days ago
    },
  ]);

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
