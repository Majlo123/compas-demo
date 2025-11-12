import { FC } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/useAuthStore';

const UnauthenticatedRoutes: FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default UnauthenticatedRoutes;
