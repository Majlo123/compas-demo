export interface User {
  id: string;
  fullName: string;
  email: string;
  vacationDaysInit?: number;
  vacationDaysLeft?: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  emailNotificationsEnabled?: boolean;
  vacationDays?: number;
  profileImageBlob?: string;
  vacationDaysInit?: number;
  vacationDaysLeft?: number;
}

export interface UserWithVacationDays {
  id: string;
  fullName: string;
  email: string;
  role: string;
  vacationDaysInit: number;
  vacationDaysLeft: number;
}

export interface SearchUsersResponse {
  success: boolean;
  content: User[];
}
