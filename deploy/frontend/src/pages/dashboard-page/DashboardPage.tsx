import React, { useState } from 'react';
import Button from '@/components/controls/button/Button';
import PlusIcon from '@/components/images/PlusIcon';

const DashboardPage: React.FC = () => {
  const [widgets] = useState<any[]>([]);

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
      </div>
      
      {/* Content Area */}
      <div className="min-h-[500px]">
        {widgets.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20 text-center">
            <div className="mb-6">
              <p className="text-gray-500 text-lg mb-2">No widgets added yet</p>
              <p className="text-gray-400 text-sm">Get started by adding your first widget to the dashboard</p>
            </div>
            <Button 
              variant="primary" 
              size="md"
              Icon={PlusIcon}
              onClick={() => {
                // TODO: Implement widget addition functionality
                console.log('Add widget clicked');
              }}
            >
              Add Widget
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Widgets will be rendered here */}
            {widgets.map((widget) => (
              <div key={widget.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Widget content */}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;

