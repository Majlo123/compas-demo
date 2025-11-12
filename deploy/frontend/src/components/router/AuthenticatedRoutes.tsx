import { FC } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/useAuthStore';

const AuthenticatedRoutes: FC = () => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default AuthenticatedRoutes;
