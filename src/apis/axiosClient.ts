// apis/axiosClient.ts
import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-api.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (value) => value.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
