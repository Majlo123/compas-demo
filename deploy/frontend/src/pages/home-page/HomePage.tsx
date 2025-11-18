import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFromLocalStorage, removeFromLocalStorage } from '@/services/local.storage';
import Button from '@/components/controls/button/Button';
import { useAuthStore } from '@/stores/useAuthStore';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuthStore();
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    const userString = getFromLocalStorage('user');
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    authLogout();
    removeFromLocalStorage('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">Welcome to Vacation Tracker</h1>
              {user && (
                <div className="text-gray-600">
                  <p className="text-lg">
                    <span className="font-medium">Name:</span> {user.fullName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              )}
            </div>
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
              Log out
            </Button>
          </div>
          
          <div className="border-t pt-6">
            <p className="text-gray-600">Your dashboard content goes here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;