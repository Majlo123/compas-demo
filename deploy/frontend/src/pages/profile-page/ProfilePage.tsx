import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import PageLayout from '@/components/layout/PageLayout';
import { getUserProfile, updateEmailNotificationPreference, uploadProfileImage } from '@/api/user/user.actions';
import Card from '@/components/layout/Card';
import { getTeamsByUserId } from '@/api/team/team.actions';
import { getMyLeaveRequests } from '@/api/leave-request/leaveRequest.actions';
import { isApiSuccess } from '@/api/shared.types';
import { Team } from '@/api/team/team.types';
import { LeaveRequest } from '@/api/leave-request/leaveRequest.types';
import { RoleEnum } from '../../../../shared/auth.types';
import Button from '@/components/controls/button/Button';
import DialogChangePassword from '@/components/dialog/DialogChangePassword';
import { getLeaveTypeColor, getTypeLabel } from '@/utils/colorUtils';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  emailNotificationsEnabled?: boolean;
  vacationDaysInit?: number;
  vacationDaysLeft?: number;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [isUpdatingNotification, setIsUpdatingNotification] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string; x: number; y: number }>({
    visible: false,
    content: '',
    x: 0,
    y: 0,
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isHoveringProfilePic, setIsHoveringProfilePic] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // When profile is available, load any per-user cached profile image
  useEffect(() => {
    if (profile && profile.id) {
      const savedImage = localStorage.getItem(`profileImage:${profile.id}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [profile]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await getUserProfile();
      if (isApiSuccess(response)) {
        setProfile(response.content);
        
        // Load profile image from database if available
        if (response.content.profileImageBlob) {
          setProfileImage(response.content.profileImageBlob);
          // Save under per-user key
          const key = `profileImage:${response.content.id}`;
          localStorage.setItem(key, response.content.profileImageBlob);
          // Dispatch event to update header for this user only
          window.dispatchEvent(
            new CustomEvent('profileImageUpdated', {
              detail: { profileImage: response.content.profileImageBlob, userId: response.content.id },
            })
          );
        }
        
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

  const handleEmailNotificationToggle = async (enabled: boolean) => {
    setIsUpdatingNotification(true);
    try {
      const response = await updateEmailNotificationPreference(enabled);
      if (isApiSuccess(response)) {
        setProfile(prev => prev ? { ...prev, emailNotificationsEnabled: enabled } : null);
        toast.success(enabled ? 'Mail notifications enabled' : 'Mail notifications disabled');
      } else {
        toast.error(response.error?.message || 'Failed to update notification preference');
      }
    } catch (err) {
      toast.error('An error occurred while updating notification preference');
    } finally {
      setIsUpdatingNotification(false);
    }
  };

  const getUserInitials = (fullName: string): string => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Create preview and save to database
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setProfileImage(result);

          // Ensure we have the current user's id
          const userId = profile?.id;
          if (userId) {
            // Save to localStorage under per-user key for immediate display
            const key = `profileImage:${userId}`;
            localStorage.setItem(key, result);
          }

          // Extract base64 from data URL and upload to database
          const base64Data = result.split(',')[1]; // Remove "data:image/png;base64," part
          const response = await uploadProfileImage(base64Data);
          if (isApiSuccess(response)) {
            // Dispatch custom event for immediate header update (include userId)
            window.dispatchEvent(
              new CustomEvent('profileImageUpdated', {
                detail: { profileImage: result, userId: profile?.id },
              })
            );
            toast.success('Profile picture saved successfully!');
          } else {
            toast.error(response.error?.message || 'Failed to save profile picture');
          }
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    event.target.value = '';
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
  const vacationData = {
    totalVacationDays: profile?.vacationDaysInit ?? 0,
    vacationDaysRemaining: profile?.vacationDaysLeft ?? 0,
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
              <div className="flex-shrink-0 relative group">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload profile picture"
                />

                {/* Profile Picture Container */}
                <button
                  onClick={handleProfileImageClick}
                  onMouseEnter={() => setIsHoveringProfilePic(true)}
                  onMouseLeave={() => setIsHoveringProfilePic(false)}
                  className={`
                    relative w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold
                    border-2 transition-all duration-200 cursor-pointer
                    ${profileImage 
                      ? 'border-primary bg-gray-100' 
                      : 'bg-primary border-primary text-white'
                    }
                    ${isHoveringProfilePic 
                      ? 'ring-4 ring-primary ring-offset-2 scale-105 shadow-lg' 
                      : 'shadow'
                    }
                  `}
                  title="Click to change profile picture"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className={isHoveringProfilePic ? 'text-primary' : ''}>
                      {getUserInitials(profile.fullName)}
                    </span>
                  )}

                  {/* Hover overlay with camera icon */}
                  {isHoveringProfilePic && (
                    <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.fullName}</h2>
                <p className="text-gray-600 mb-2">{profile.email}</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary capitalize">
                  {profile.role}
                </span>
              </div>
              
              <div className="flex-shrink-0 flex flex-col gap-3">
                <Button
                  onClick={() => setChangePasswordDialogOpen(true)}
                  variant="secondary"
                  className="text-sm"
                >
                  Change Password
                </Button>
                
                {/* Mail Notifications Toggle */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <button
                    onClick={() => handleEmailNotificationToggle(!profile.emailNotificationsEnabled)}
                    disabled={isUpdatingNotification}
                    className={`
                      relative inline-flex h-6 w-11 rounded-full transition-colors
                      ${profile.emailNotificationsEnabled 
                        ? 'bg-primary' 
                        : 'bg-gray-300'
                      }
                      ${isUpdatingNotification ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    title={profile.emailNotificationsEnabled ? 'Mail notifications enabled' : 'Mail notifications disabled'}
                  >
                    <span
                      className={`
                        inline-block h-5 w-5 transform rounded-full bg-white shadow
                        transition-transform
                        ${profile.emailNotificationsEnabled 
                          ? 'translate-x-5' 
                          : 'translate-x-0.5'
                        }
                      `}
                    />
                  </button>
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Mail Notifications
                  </span>
                </div>
              </div>
            </div>

            {/* Vacation Days Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Vacation Days</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Days Remaining</div>
                  <div className="text-3xl font-bold text-primary">{vacationData.vacationDaysRemaining}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Vacation Days</div>
                  <div className="text-3xl font-bold text-gray-800">{vacationData.totalVacationDays}</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Remaining: {vacationData.vacationDaysRemaining} days</span>
                  <span>Used: {vacationData.totalVacationDays - vacationData.vacationDaysRemaining} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{
                      width: vacationData.totalVacationDays > 0 
                        ? `${(vacationData.vacationDaysRemaining / vacationData.totalVacationDays) * 100}%`
                        : '0%',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Teams Section - Only for non-admin users */}
          {profile.role !== RoleEnum.Admin && (
            <Card title="My Projects" className="mt-6">
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
                    <p className="text-gray-600">You are not currently assigned to any projects.</p>
                    <p className="text-sm text-gray-500 mt-1">Contact your administrator to be added to a project.</p>
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
                        const typeLabel = getTypeLabel(value.type);
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
