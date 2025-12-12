import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { RoleEnum } from '../../../../../shared/auth.types';

const TeamManagerGuard: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/team-calendar" replace />;
  }

  // Admin always has access
  if (user.role === RoleEnum.Admin) {
    return <Outlet />;
  }

  // For employees, check isTeamManager flag from store
  if (!user.isTeamManager) {
    return <Navigate to="/team-calendar" replace />;
  }

  return <Outlet />;
};

export default TeamManagerGuard;
