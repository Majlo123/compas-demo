import React from 'react';
import { NavLink } from 'react-router-dom';
import TableIconCalendar from '@/components/images/TableIconCalendar';
import DashboardIcon from '@/components/images/DashboardIcon';
import CheckCircleIcon from '@/components/images/CheckCircleIcon';
import ReportsIcon from '@/components/images/ReportsIcon';
import SettingsIcon from '@/components/images/SettingsIcon';
import classNameBuilder from '@/utils/classNameBuilder';

type NavItem = {
  label: string;
  path: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', Icon: DashboardIcon },
  { label: 'My Requests', path: '/my-leave-requests', Icon: CheckCircleIcon },
  { label: 'Team Calendar', path: '/team-calendar', Icon: TableIconCalendar },
  { label: 'Reports', path: '/reports', Icon: ReportsIcon },
  { label: 'Settings', path: '/settings', Icon: SettingsIcon },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-primary flex flex-col h-full rounded-l-2xl overflow-hidden">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 text-white">
          <TableIconCalendar className="w-8 h-8 stroke-white" />
          <span className="text-xl font-semibold">Vacation Tracker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  classNameBuilder(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    'text-white/80 hover:text-white hover:bg-white/10',
                    isActive && 'bg-white/20 text-white font-medium'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.Icon className={classNameBuilder(
                      'w-5 h-5',
                      isActive ? 'stroke-white' : 'stroke-white/80'
                    )} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Organization/User Info at bottom */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 text-white/80">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm font-medium">AC</span>
          </div>
          <span className="text-sm">Acme Inc.</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
