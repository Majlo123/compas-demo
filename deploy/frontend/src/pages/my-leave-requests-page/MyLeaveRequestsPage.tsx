import React from 'react';
import Button from '@/components/controls/button/Button';

const MyLeaveRequestsPage: React.FC = () => {
  const handleNewRequest = () => {
    console.log('New leave request clicked');
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">My Leave Requests</h1>
        <Button onClick={handleNewRequest}>
          + New Leave Request
        </Button>
      </div>

      {/* Content Area */}
      <div className="text-gray-500 text-center py-12">
        Leave requests table will be displayed here
      </div>
    </>
  );
};

export default MyLeaveRequestsPage;
