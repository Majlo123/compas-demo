import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

const AuthRedirect: FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default AuthRedirect;
