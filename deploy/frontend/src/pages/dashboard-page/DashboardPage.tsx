import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
      </div>
      
      {/* Content Area */}
      <div>
        Dashboard content will be displayed here
      </div>
    </>
  );
};

export default DashboardPage;
