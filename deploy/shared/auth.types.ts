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
  };
};