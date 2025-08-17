import { create } from 'zustand';
import authApi from '../apis/auth.api';
import type { LoginPayload } from '../apis/auth.api';
import type { User } from '../types/user.type';

interface AuthState {
  users: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  message: string | null;
  setUser: (users: User | null) => void;
  clearUser: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

// Lấy dữ liệu từ localStorage khi khởi tạo
const storedUser = localStorage.getItem('users');
const storedAccessToken = localStorage.getItem('accessToken');
const storedRefreshToken = localStorage.getItem('refreshToken');

export const useAuthStore = create<AuthState>((set) => ({
  users: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedAccessToken || null,
  refreshToken: storedRefreshToken || null,
  message: null,

  setUser: (users) => {
    set({ users });
    if (users) {
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      localStorage.removeItem('users');
    }
  },

  clearUser: () => {
    set({ users: null, accessToken: null, refreshToken: null });
    localStorage.removeItem('users');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  login: async (payload) => {
    try {
      const response = await authApi.login(payload);

      set({
        users: response.data.users,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        message: response.data.message,
      });

      // Lưu vào localStorage
      localStorage.setItem('users', JSON.stringify(response.data.users));
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },
  logout: () => {
    set({ users: null, accessToken: null, refreshToken: null });
    localStorage.removeItem('users');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
}));
