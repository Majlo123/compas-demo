export type Role = 'employee' | 'admin';

export const RoleEnum = {
  Employee: 'employee',
  Admin: 'admin',
} as const;

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
};

export type RegisterResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
  };
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
    isTeamManager: boolean;
  };
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};