import { FC } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/useAuthStore';
import { RoleEnum } from '../../../../shared/auth.types';

const EmployeeRoutes: FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user || user.role !== RoleEnum.Employee) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default EmployeeRoutes;
