import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

const AuthRedirect: FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);

  if (isLoggedIn) {
    // Admins and managers can access dashboard
    if (user?.role === 'admin' || user?.isTeamManager) {
      return <Navigate to="/dashboard" replace />;
    }
    // Employees default to calendar
    return <Navigate to="/team-calendar" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default AuthRedirect;
