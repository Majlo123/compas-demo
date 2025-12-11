import React from 'react';
import { WidgetComponentProps } from '@/components/dashboard/WidgetRenderer';

const TeamOverviewWidget: React.FC<WidgetComponentProps> = () => (
  <div className="h-full flex flex-col">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">Team Overview</h3>
    <div className="flex-1 overflow-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Team</th>
            <th className="pb-2">Members</th>
            <th className="pb-2">On Leave</th>
          </tr>
        </thead>
        <tbody>
          {[
            { team: 'Engineering', members: 12, onLeave: 2 },
            { team: 'Design', members: 5, onLeave: 1 },
            { team: 'Marketing', members: 8, onLeave: 0 },
            { team: 'Sales', members: 10, onLeave: 3 },
          ].map((row, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-2 font-medium">{row.team}</td>
              <td className="py-2">{row.members}</td>
              <td className="py-2">
                <span className={row.onLeave > 0 ? 'text-yellow-600' : 'text-green-600'}>{row.onLeave}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TeamOverviewWidget;
