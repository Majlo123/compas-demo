import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

import {
  getFromLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage,
} from '@/services/local.storage';
import { login as loginApi } from '@/api/auth.actions';
import { isApiSuccess } from '@/api/shared.types';
import { Role, LoginRequest } from '../../../shared/auth.types';

enum TokenActionTypeENUM {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

type DecodedToken = {
  email?: string;
  role?: Role;
  actionType?: TokenActionTypeENUM;
  exp?: number;
};

type AuthState = {
  isInitialized: boolean;
  isLoggedIn: boolean;
  user: { id: string; email: string; fullName: string; role: Role } | null;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  initialize: () => void;
};

const isAccessToken = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return !decoded.actionType;
  } catch {
    return false;
  }
};

export const useAuthStore = create<AuthState>((set) => {
  return {
    isInitialized: false,
    isLoggedIn: false,
    user: null,

    login: async (credentials: LoginRequest): Promise<{ success: boolean; message?: string }> => {
      const response = await loginApi(credentials);
      
      if (!isApiSuccess(response)) {
        return { success: false, message: response.error?.message || 'Login failed' };
      }

      setToLocalStorage('token', response.content.token);
      setToLocalStorage('user', JSON.stringify(response.content.user));
      set({ 
        isLoggedIn: isAccessToken(response.content.token),
        user: response.content.user,
      });
      
      return { success: true };
    },

    logout: (): void => {
      removeFromLocalStorage('token');
      removeFromLocalStorage('user');
      set({ isLoggedIn: false, user: null });
    },

    initialize: (): void => {
      const token = getFromLocalStorage('token');
      const userStr = getFromLocalStorage('user');
      const user = userStr ? JSON.parse(userStr) : null;

      set({
        isInitialized: true,
        isLoggedIn: isAccessToken(token),
        user,
      });
    },
  };
});
