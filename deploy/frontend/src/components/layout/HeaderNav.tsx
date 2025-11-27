import React from 'react';
import { useNavigate } from 'react-router-dom';
import BellIcon from '@/components/images/BellIcon';
import { useAuthStore } from '@/stores/useAuthStore';
import { getFromLocalStorage } from '@/services/local.storage';

const HeaderNav: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  return (
    <header className="bg-headerBg border-b border-2 border-headerBorder flex items-center justify-between px-4 py-2">
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
        <button
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <BellIcon className="w-5 h-5 stroke-gray-600" />
          {/* Notification badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
              {getUserInitials()}
            </div>
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
