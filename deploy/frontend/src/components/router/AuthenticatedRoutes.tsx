import { FC } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/useAuthStore';

const AuthenticatedRoutes: FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthenticatedRoutes;
