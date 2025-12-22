import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ClipboardList, FolderCog, CalendarX, ShieldUser, CalendarClock } from 'lucide-react';
import TableIconCalendar from '@/components/images/TableIconCalendar';
import DashboardIcon from '@/components/images/DashboardIcon';
import CheckCircleIcon from '@/components/images/CheckCircleIcon';
import TableIconUser from '@/components/images/TableIconUser';
import TeamsIcon from '@/components/images/TeamsIcon';
import TableIconEdit from '@/components/images/TableIconEdit';
import classNameBuilder from '@/utils/classNameBuilder';
import { useAuthStore } from '@/stores/useAuthStore';
import { RoleEnum, Role } from '../../../../shared/auth.types';

type NavItem = {
  label: string;
  path: string;
  Icon: React.ComponentType<{ className?: string }>;
  allowedRoles?: Role[];
  requiresTeamManager?: boolean;
};
const mainNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', Icon: DashboardIcon, requiresTeamManager: true },
  { label: 'My Requests', path: '/my-leave-requests', Icon: CheckCircleIcon, allowedRoles: [RoleEnum.Employee] },
  { label: 'Leave Requests', path: '/team-requests', Icon: TableIconEdit, allowedRoles: [RoleEnum.Admin] },
  { label: 'Time Entries', path: '/time-entries', Icon: CalendarClock },
  { label: 'Calendar', path: '/team-calendar', Icon: TableIconCalendar },
  { label: 'Days Off', path: '/days-off', Icon: CalendarX, allowedRoles: [RoleEnum.Admin] },
];

const manageOrgItems: NavItem[] = [
  { label: 'Users', path: '/users', Icon: TableIconUser, allowedRoles: [RoleEnum.Admin] },
  { label: 'Projects', path: '/teams-list', Icon: ClipboardList, allowedRoles: [RoleEnum.Admin] },
  { label: 'Clients', path: '/clients', Icon: ShieldUser, allowedRoles: [RoleEnum.Admin] },
];

const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const canShow = (item: NavItem) => {
    if (item.requiresTeamManager) {
      if (!user) return false;
      return user.role === RoleEnum.Admin || user.isTeamManager === true;
    }
    if (item.path === '/team-requests') {
      if (!user) return false;
      return user.role === RoleEnum.Admin || user.isTeamManager === true;
    }
    if (!item.allowedRoles) return true;
    if (!user) return false;
    return item.allowedRoles.includes(user.role);
  };

  const visibleMainNavItems = useMemo(
    () => mainNavItems.filter(canShow),
    [user]
  );

  const visibleManageNavItems = useMemo(
    () => manageOrgItems.filter(canShow),
    [user]
  );

  const isManageActive = useMemo(
    () => visibleManageNavItems.some((item) => location.pathname.startsWith(item.path)),
    [visibleManageNavItems, location.pathname]
  );

  const [isManageOpen, setIsManageOpen] = useState(isManageActive);

  useEffect(() => {
    if (isManageActive) setIsManageOpen(true);
  }, [isManageActive]);

  return (
    <aside className="min-w-48 bg-primary flex flex-col h-full rounded-l-2xl overflow-hidden">
      {/* Logo/Brand */}
      <div className="p-4 border-b border-sidebarBorder">
        <div className="flex items-center gap-3 text-white">
          <TableIconCalendar className="w-6 h-6 stroke-white" />
          <span className="text-xl font-semibold">Vacation Tracker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-3">
          {visibleMainNavItems.map((item) => (
            <React.Fragment key={item.path}>
              <li>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    classNameBuilder(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm',
                      'text-sidebarText hover:text-white hover:bg-sidebarNavHover',
                      isActive && 'bg-sidebarNavActive text-white font-medium '
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.Icon className={classNameBuilder(
                        'w-5 h-5',
                        isActive ? 'stroke-white' : 'stroke-sidebarText'
                      )} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>

              {item.path === '/team-requests' && visibleManageNavItems.length > 0 && (
                <li className="mt-2">
                  <button
                    type="button"
                    onClick={() => setIsManageOpen((prev) => !prev)}
                    className={classNameBuilder(
                      'flex w-full items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors',
                      'text-sidebarText hover:text-white hover:bg-sidebarNavHover'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <FolderCog className="w-5 h-5 stroke-sidebarText" />
                      <span>Manage Organization</span>
                    </span>
                    <svg
                      className={classNameBuilder(
                        'w-4 h-4 transition-transform',
                        isManageOpen ? 'rotate-180' : 'rotate-0'
                      )}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 7.5L10 12l4.5-4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {isManageOpen && (
                    <ul className="mt-2 space-y-1">
                      {visibleManageNavItems.map((manageItem) => (
                        <li key={manageItem.path}>
                          <NavLink
                            to={manageItem.path}
                            className={({ isActive }) =>
                              classNameBuilder(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm pl-10',
                                'text-sidebarText hover:text-white hover:bg-sidebarNavHover',
                                isActive && 'bg-sidebarNavActive text-white font-medium '
                              )
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <manageItem.Icon className={classNameBuilder(
                                  'w-5 h-5',
                                  isActive ? 'stroke-white' : 'stroke-sidebarText'
                                )} />
                                <span>{manageItem.label}</span>
                              </>
                            )}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>

      {/* Organization/User Info at bottom */}
      <div className="p-2 border-t border-sidebarBorder">
        <div className="flex items-center gap-3 px-2 py-2 text-sidebarText">
          <div className="w-10 h-10 rounded-full bg-sidebarFooterBg flex items-center justify-center">
            <span className="text-sm font-medium">AC</span>
          </div>
          <span className="text-sm">Acme Inc.</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
