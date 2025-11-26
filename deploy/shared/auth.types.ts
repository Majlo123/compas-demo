export type Role = 'employee' | 'manager' | 'admin';

export const RoleEnum = {
  Employee: 'employee',
  Manager: 'manager',
  Admin: 'admin',
} as const;

// export type RoleEnumType = (typeof RoleEnum)[keyof typeof RoleEnum];

// export const Role = {
//   Employee: 'employee',
//   Manager: 'manager',
//   Admin: 'admin',
// } as const;

// export type Role = (typeof Role)[keyof typeof Role];
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
  };
};