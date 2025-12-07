export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  emailNotificationsEnabled?: boolean;
}

export interface SearchUsersResponse {
  success: boolean;
  content: User[];
}
