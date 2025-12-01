export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface SearchUsersResponse {
  success: boolean;
  content: User[];
}
