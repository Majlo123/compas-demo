export interface User {
  id: string;
  fullName: string;
  email: string;
  vacationDays?: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  emailNotificationsEnabled?: boolean;
  vacationDays?: number;
}

export interface UserWithVacationDays {
  id: string;
  fullName: string;
  email: string;
  role: string;
  vacationDays: number;
}

export interface SearchUsersResponse {
  success: boolean;
  content: User[];
}
