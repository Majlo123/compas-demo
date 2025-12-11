import React from 'react';

const UpcomingLeavesWidget: React.FC = () => (
  <div className="h-full flex flex-col">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">Upcoming Leaves</h3>
    <div className="flex-1 overflow-auto">
      <div className="space-y-2">
        {[
          { name: 'John Doe', date: 'Dec 20-24', type: 'Vacation' },
          { name: 'Jane Smith', date: 'Dec 23-27', type: 'Personal' },
          { name: 'Bob Johnson', date: 'Dec 26-30', type: 'Vacation' },
        ].map((leave, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
            <div>
              <p className="font-medium text-gray-800">{leave.name}</p>
              <p className="text-gray-500">{leave.date}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                leave.type === 'Vacation' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {leave.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default UpcomingLeavesWidget;
