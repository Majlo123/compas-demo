import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  return (
    <div
      id="dashboard-layout"
      className="flex flex-row w-full h-full overflow-hidden bg-lightGrey"
    >
      {/* <DashboardSidebar /> */}
      <main
        id="dashboard-main"
        className="flex flex-col flex-auto h-full overflow-hidden"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
