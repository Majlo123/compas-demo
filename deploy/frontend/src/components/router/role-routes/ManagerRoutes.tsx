// import { FC } from 'react';
// import { Outlet, Navigate } from 'react-router-dom';

// import { useAuthStore } from '@/stores/useAuthStore';
// import { RoleEnum } from '../../../../../shared/auth.types';

// const ManagerRoutes: FC = () => {
//   const user = useAuthStore((state) => state.user);

//   if (!user || user.role !== RoleEnum.Manager) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// };

// export default ManagerRoutes;
