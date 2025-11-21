import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

import {
  getFromLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage,
} from '@/services/local.storage';
import { login as loginApi } from '@/api/auth.actions';
import { isApiSuccess } from '@/api/shared.types';
import { LoginRequest } from '@/api/auth/auth.types';

enum TokenActionTypeENUM {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

type DecodedToken = {
  email?: string;
  actionType?: TokenActionTypeENUM;
  exp?: number;
};

type AuthState = {
  isInitialized: boolean;
  isLoggedIn: boolean;
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

    login: async (credentials: LoginRequest): Promise<{ success: boolean; message?: string }> => {
      const response = await loginApi(credentials);
      
      if (!isApiSuccess(response)) {
        return { success: false, message: response.error?.message || 'Login failed' };
      }

      setToLocalStorage('token', response.content.token);
      set({ isLoggedIn: isAccessToken(response.content.token) });
      
      return { success: true };
    },

    logout: (): void => {
      removeFromLocalStorage('token');
      set({ isLoggedIn: false });
    },

    initialize: (): void => {
      const token = getFromLocalStorage('token');

      set({
        isInitialized: true,
        isLoggedIn: isAccessToken(token),
      });
    },
  };
});
