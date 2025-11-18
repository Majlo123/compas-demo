import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthenticationLayout from '@/components/layout/AuthenticationLayout.tsx';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthenticatedRoutes from '@/components/router/AuthenticatedRoutes.tsx';
import AuthRedirect from '@/components/router/AuthRedirect.tsx';
import UnauthenticatedRoutes from '@/components/router/UnauthenticatedRoutes.tsx';
import NotFoundPage from '@/pages/not-found-page/NotFoundPage';
import HomePage from '@/pages/home-page/HomePage';
import LoginPage from '@/pages/login-page/LoginPage';
import RegisterPage from '@/pages/register-page/RegisterPage';

const Router: FC = () => {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        
        <Route element={<UnauthenticatedRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<AuthenticatedRoutes />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
