import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthenticationLayout: React.FC = () => {
  return (
    <div
      id="authentication-layout"
      className="flex flex-col min-w-screen min-h-screen max-h-full"
    >
      <main className="flex bg-white w-full h-full justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticationLayout;
