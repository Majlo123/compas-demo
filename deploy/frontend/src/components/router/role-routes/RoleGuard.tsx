import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/useAuthStore';
import { Role } from '../../../../../shared/auth.types';

type RoleGuardProps = {
  allowedRoles: Role[];
};

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/team-calendar" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
