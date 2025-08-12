import axiosClient from './axiosClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    address?: string;
  };
  message: string;
}

const authAPI = {
  login: (payload: LoginPayload) => {
    return axiosClient.post<LoginResponse>('/auth/login', payload);
  },
};

export default authAPI;
