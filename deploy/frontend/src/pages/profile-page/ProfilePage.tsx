import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageLayout from '@/components/layout/PageLayout';
import { getUserProfile, updateEmailNotificationPreference } from '@/api/user/user.actions';
import { getTeamsByUserId } from '@/api/team/team.actions';
import { isApiSuccess } from '@/api/shared.types';
import { Team } from '@/api/team/team.types';
import { RoleEnum } from '../../../../shared/auth.types';
import Button from '@/components/controls/button/Button';
import DialogChangePassword from '@/components/dialog/DialogChangePassword';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  emailNotificationsEnabled?: boolean;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [isUpdatingNotification, setIsUpdatingNotification] = useState(false);

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
        
        // Fetch teams for non-admin users
        if (response.content.role !== RoleEnum.Admin) {
          const teamsResponse = await getTeamsByUserId(response.content.id);
          if (isApiSuccess(teamsResponse)) {
            setTeams(teamsResponse.content.data);
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

            {/* Teams Section - Only for non-admin users */}
            {profile.role !== RoleEnum.Admin && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">My Teams</h3>
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
              </div>
            )}
          </div>
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
