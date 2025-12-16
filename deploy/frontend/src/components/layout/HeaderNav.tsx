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
import { getUserProfile } from '@/api/user/user.actions';
import { set } from 'lodash';

const HeaderNav: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
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

  // Initial load: set profile image for the current user (if cached)
  useEffect(() => {
    const userString = getFromLocalStorage('user');
    let currentUserId: string | null = null;
    if (userString) {
      try {
        const user = JSON.parse(userString);
        currentUserId = user?.id || null;
      } catch {
        currentUserId = null;
      }
    }

    if (currentUserId) {
      const savedImage = localStorage.getItem(`profileImage:${currentUserId}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, []);

  // Cross-tab sync: update profile image when localStorage changes for this user
  useEffect(() => {
    const userString = getFromLocalStorage('user');
    let currentUserId: string | null = null;
    if (userString) {
      try {
        const user = JSON.parse(userString);
        currentUserId = user?.id || null;
      } catch {
        currentUserId = null;
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (!currentUserId) return;
      if (e.key === `profileImage:${currentUserId}`) {
        setProfileImage(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Same-tab updates: listen for custom `profileImageUpdated` events and apply if for current user
  useEffect(() => {
    const userString = getFromLocalStorage('user');
    let currentUserId: string | null = null;
    if (userString) {
      try {
        const user = JSON.parse(userString);
        currentUserId = user?.id || null;
      } catch {
        currentUserId = null;
      }
    }

    const handleProfileImageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.profileImage && customEvent.detail.userId) {
        if (customEvent.detail.userId === currentUserId) {
          setProfileImage(customEvent.detail.profileImage);
        }
      }
    };

    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);
    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
  }, []);

  // Fallback: if no profileImage is available in localStorage/state, try fetching from API
  useEffect(() => {
    const currentUserId = user?.id;
    if (!currentUserId) return;

    const key = `profileImage:${currentUserId}`;
    const saved = localStorage.getItem(key);
    if (profileImage || saved) return; // already have image

    const loadFromApi = async () => {
      try {
        const response = await getUserProfile();
        if (isApiSuccess(response) && response.content?.profileImageBlob) {
          const blob = response.content.profileImageBlob;
          localStorage.setItem(key, blob);
          setProfileImage(blob);
        }
      } catch (err) {
        // ignore - fallback to initials
        console.debug('Failed to fetch profile image for header fallback', err);
      }
    };

    loadFromApi();
  }, [user?.id, profileImage]);

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
    // Prefer auth store user, fall back to localStorage
    const currentUser = user || (() => {
      const userString = getFromLocalStorage('user');
      if (!userString) return null;
      try { return JSON.parse(userString); } catch { return null; }
    })();

    if (currentUser && currentUser.fullName) {
      const names = currentUser.fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return currentUser.fullName[0]?.toUpperCase() || 'U';
    }

    return 'U';
  };

  const getUserInfo = (): { fullName: string; email: string } | null => {
    const currentUser = user || (() => {
      const userString = getFromLocalStorage('user');
      if (!userString) return null;
      try { return JSON.parse(userString); } catch { return null; }
    })();

    if (!currentUser) return null;
    return {
      fullName: currentUser.fullName || 'User',
      email: currentUser.email || '',
    };
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
          <img src="/assets/2c-logo.jpg" alt="2C Logo" className="w-auto h-8 rounded" />
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
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                getUserInitials()
              )}
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
