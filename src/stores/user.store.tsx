import { create } from 'zustand';
import userApi from '../apis/user.api';
import type { User } from '../types/user.type';
import type { Params } from '../apis/user.api';

interface userState {
  user: User | null;
  users: [User] | null;
  message: string | null;
  setUser: (user: User | null) => void;
  setUsers: (users: [User] | null) => void;
  getUserByConditions: (params: Params) => Promise<void>;
  getUserById: (userId: string) => Promise<void>;
  updateUserById: (userId: string, data: User) => Promise<void>;
  createUser: (data: User) => Promise<void>;
}

export const useUserStore = create<userState>((set) => ({
  user: null,
  users: null,
  message: null,
  setUser: (user) => set({ user }),
  setUsers: (users) => set({ users }),

  getUserByConditions: async (params: Params) => {
    try {
      const response = await userApi.getUsersByConditions(params);
      console.log('XXX' + response);

      set({ users: response.data.users, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const response = await userApi.getUserById(userId);
      set({ user: response.data.user, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  updateUserById: async (userId: string, data: User) => {
    try {
      const response = await userApi.updateUserById(userId, data);

      set({ user: response.data.user, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  createUser: async (data: User) => {
    try {
      const response = await userApi.createUser(data);
      console.log(response);

      set({ user: response.data.user, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
}));
