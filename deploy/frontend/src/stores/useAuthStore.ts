import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

import {
  getFromLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage,
} from '@/services/local.storage';

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
  login: (token: string) => void;
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

    login: (accessToken): void => {
      setToLocalStorage('token', accessToken);

      set({
        isLoggedIn: isAccessToken(accessToken),
      });
    },

    logout: (): void => {
      removeFromLocalStorage('token');

      set({
        isLoggedIn: false,
      });
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
