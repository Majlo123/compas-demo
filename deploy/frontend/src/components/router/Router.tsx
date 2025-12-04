import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthenticatedRoutes from '@/components/router/AuthenticatedRoutes.tsx';
import AuthRedirect from '@/components/router/AuthRedirect.tsx';
import UnauthenticatedRoutes from '@/components/router/UnauthenticatedRoutes.tsx';
import RoleGuard from '@/components/router/role-routes/RoleGuard';
import TeamManagerGuard from '@/components/router/role-routes/TeamManagerGuard';
import { RoleEnum } from '../../../../shared/auth.types';
import NotFoundPage from '@/pages/not-found-page/NotFoundPage';
import LoginPage from '@/pages/login-page/LoginPage';
import RegisterPage from '@/pages/register-page/RegisterPage';
import DashboardPage from '@/pages/dashboard-page/DashboardPage';
import MyLeaveRequestsPage from '@/pages/my-leave-requests-page/MyLeaveRequestsPage';
import TeamCalendarPage from '@/pages/team-calendar-page/TeamCalendarPage';
import ReportsPage from '@/pages/reports-page/ReportsPage';
import SettingsPage from '@/pages/settings-page/SettingsPage';
import TeamRequestsPage from '@/pages/team-requests-page/TeamRequestsPage';
import TeamsListPage from '@/pages/teams-list-page/TeamsListPage';
import TeamDetailsPage from '@/pages/team-details-page/TeamDetailsPage';
import UsersPage from '@/pages/users-page/UsersPage';
import ProfilePage from '@/pages/profile-page/ProfilePage';

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
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
            <Route element={<RoleGuard allowedRoles={[RoleEnum.Admin]} />}>
              <Route path="/teams-list" element={<TeamsListPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/team-details/:teamId" element={<TeamDetailsPage />} />
            </Route>
            
            <Route element={<TeamManagerGuard />}>
              <Route path="/team-requests" element={<TeamRequestsPage />} />
            </Route>
            
            <Route path="/my-leave-requests" element={<MyLeaveRequestsPage />} />
            
            <Route path="/profile" element={<ProfilePage />} />
            
            <Route path="/team-calendar" element={<TeamCalendarPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
