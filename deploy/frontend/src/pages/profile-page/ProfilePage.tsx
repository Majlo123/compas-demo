import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/layout/Card';
import { getUserProfile } from '@/api/user/user.actions';
import { getTeamsByUserId } from '@/api/team/team.actions';
import { getMyLeaveRequests } from '@/api/leave-request/leaveRequest.actions';
import { isApiSuccess } from '@/api/shared.types';
import { Team } from '@/api/team/team.types';
import { LeaveRequest } from '@/api/leave-request/leaveRequest.types';
import { RoleEnum } from '../../../../shared/auth.types';
import Button from '@/components/controls/button/Button';
import DialogChangePassword from '@/components/dialog/DialogChangePassword';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string; x: number; y: number }>({
    visible: false,
    content: '',
    x: 0,
    y: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await getUserProfile();
      if (isApiSuccess(response)) {
        setProfile(response.content);
        
        // Fetch teams and leave requests for non-admin users
        if (response.content.role !== RoleEnum.Admin) {
          const teamsResponse = await getTeamsByUserId(response.content.id);
          if (isApiSuccess(teamsResponse)) {
            setTeams(teamsResponse.content.data);
          }
          
          const leaveRequestsResponse = await getMyLeaveRequests();
          if (isApiSuccess(leaveRequestsResponse)) {
            setLeaveRequests(leaveRequestsResponse.content);
          }
        }
      } else {
        setHasError(true);
        toast.error(response.error?.message || 'Failed to load profile');
      }
    } catch (err) {
      setHasError(true);
      toast.error('An error occurred while loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = (fullName: string): string => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  };

  const getLeaveTypeColor = (type: string): string => {
    const colors = fullConfig.theme.colors as any;
    switch (type) {
      case 'vacation':
        return colors['vacation-leave'];
      case 'sick':
        return colors['sick-leave'];
      case 'personal':
        return colors['personal-leave'];
      case 'other':
        return colors['other-leave'];
      default:
        return colors.primary;
    }
  };

  const prepareHeatmapData = () => {
    const heatmapData: Array<{ date: string; count: number; type: string }> = [];
    
    leaveRequests
      .filter(req => req.status === 'approved')
      .forEach(req => {
        const startDate = new Date(req.startDate);
        const endDate = new Date(req.endDate);
        
        // Generate all dates between start and end
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          // Only include dates in the selected year
          if (d.getFullYear() === selectedYear) {
            heatmapData.push({
              date: d.toISOString().split('T')[0],
              count: 1,
              type: req.type,
            });
          }
        }
      });
    
    return heatmapData;
  };

  // Sample data - will be replaced with real calculation later
  const sampleVacationData = {
    totalVacationDays: 20,
    vacationDaysRemaining: 15,
  };

  return (
    <PageLayout
      title="My Profile"
      description="View and manage your profile information"
      isLoading={isLoading}
      hasError={hasError}
      isEmpty={false}
      onRetry={fetchProfile}
    >
      {profile && (
        <div className="max-w-3xl">
          {/* Profile Card */}
          <Card>
            {/* Profile Picture and Basic Info */}
            <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-200">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold border-2 border-primary">
                  {getUserInitials(profile.fullName)}
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.fullName}</h2>
                <p className="text-gray-600 mb-2">{profile.email}</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary capitalize">
                  {profile.role}
                </span>
              </div>
              
              <div className="flex-shrink-0">
                <Button
                  onClick={() => setChangePasswordDialogOpen(true)}
                  variant="secondary"
                  className="text-sm"
                >
                  Change Password
                </Button>
              </div>
            </div>

            {/* Vacation Days Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Vacation Days</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Vacation Days</div>
                  <div className="text-3xl font-bold text-gray-800">{sampleVacationData.totalVacationDays}</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Days Remaining</div>
                  <div className="text-3xl font-bold text-primary">{sampleVacationData.vacationDaysRemaining}</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Remaining: {sampleVacationData.vacationDaysRemaining} days</span>
                  <span>Used: {sampleVacationData.totalVacationDays - sampleVacationData.vacationDaysRemaining} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${(sampleVacationData.vacationDaysRemaining / sampleVacationData.totalVacationDays) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Teams Section - Only for non-admin users */}
          {profile.role !== RoleEnum.Admin && (
            <Card title="My Teams" className="mt-6">
                {teams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {teams.map((team) => (
                      <div key={team.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="font-medium text-gray-800">{team.name}</div>
                        {team.description && (
                          <div className="text-sm text-gray-600 mt-1">{team.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600">You are not currently assigned to any teams.</p>
                    <p className="text-sm text-gray-500 mt-1">Contact your administrator to be added to a team.</p>
                  </div>
                )}
            </Card>
          )}

          {/* Vacation History Heatmap - Only for non-admin users */}
          {profile.role !== RoleEnum.Admin && leaveRequests.length > 0 && (
            <Card className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Leave Request History</h3>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                  <button
                    onClick={() => setSelectedYear(selectedYear - 1)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Previous year"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="font-semibold text-gray-800 min-w-[50px] text-center">{selectedYear}</span>
                  <button
                    onClick={() => setSelectedYear(selectedYear + 1)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Next year"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                  <CalendarHeatmap
                    startDate={new Date(selectedYear, 0, 1)}
                    endDate={new Date(selectedYear, 11, 31)}
                    values={prepareHeatmapData()}
                    classForValue={(value) => {
                      if (!value || !value.count) {
                        return 'color-empty';
                      }
                      return `color-${value.type}`;
                    }}
                    transformDayElement={(element: any, value: any) => {
                      if (value && value.date && value.type) {
                        const formattedDate = format(new Date(value.date + 'T00:00:00'), 'dd.MM.yyyy');
                        const typeLabel = value.type.charAt(0).toUpperCase() + value.type.slice(1);
                        const tooltipText = `${formattedDate} - ${typeLabel} Leave`;
                        
                        return React.cloneElement(element, {
                          onMouseEnter: (e: MouseEvent) => {
                            const rect = (e.target as HTMLElement).getBoundingClientRect();
                            setTooltip({
                              visible: true,
                              content: tooltipText,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            });
                          },
                          onMouseLeave: () => {
                            setTooltip({ visible: false, content: '', x: 0, y: 0 });
                          },
                        });
                      }
                      return element;
                    }}
                    showWeekdayLabels
                  />
                  <style>{`
                    .react-calendar-heatmap .color-empty { fill: #ebedf0; }
                    .react-calendar-heatmap .color-vacation { fill: ${getLeaveTypeColor('vacation')}; }
                    .react-calendar-heatmap .color-sick { fill: ${getLeaveTypeColor('sick')}; }
                    .react-calendar-heatmap .color-personal { fill: ${getLeaveTypeColor('personal')}; }
                    .react-calendar-heatmap .color-other { fill: ${getLeaveTypeColor('other')}; }
                    .react-calendar-heatmap rect { cursor: pointer; }
                    .react-calendar-heatmap rect:hover { filter: brightness(0.85); }
                  `}</style>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-6 mt-4 justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-vacation-leave"></div>
                      <span className="text-xs text-gray-600">Vacation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-sick-leave"></div>
                      <span className="text-xs text-gray-600">Sick</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-personal-leave"></div>
                      <span className="text-xs text-gray-600">Personal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-other-leave"></div>
                      <span className="text-xs text-gray-600">Other</span>
                    </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
      
      {/* Custom Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          {tooltip.content}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
        </div>
      )}
      <DialogChangePassword
        isOpen={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
        onSuccess={fetchProfile}
      />
    </PageLayout>
  );
};

export default ProfilePage;
