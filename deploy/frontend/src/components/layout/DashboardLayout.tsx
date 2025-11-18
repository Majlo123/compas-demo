import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import HeaderNav from './HeaderNav';

const DashboardLayout: React.FC = () => {
  return (
    <div
      id="dashboard-layout"
      className="flex flex-row w-full h-full overflow-hidden bg-[#F9FAFD] p-10 rounded-2xl"
    >
      <Sidebar />
      <main
        id="dashboard-main"
        className="flex flex-col flex-auto h-full overflow-hidden pl-10"
      >
        <HeaderNav />
        <div className="flex-1 overflow-auto pt-10">
          <div className="bg-[#F9FAFD] rounded-2xl shadow-sm p-8 h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
