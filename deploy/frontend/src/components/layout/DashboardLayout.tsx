import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import HeaderNav from './HeaderNav';

const DashboardLayout: React.FC = () => {
  return (
    <div
      id="dashboard-layout"
      className="flex flex-row w-full h-full overflow-hidden bg-layoutBg p-10 rounded-2xl"
    >
      <Sidebar />
      <main
        id="dashboard-main"
        className="flex flex-col flex-auto overflow-scroll pl-10"
      >
        <HeaderNav />
        <div className="flex-1 overflow-auto pt-sm h-full">
          <div className="bg-layoutBg rounded-2xl p-md h-full min-h-0">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
