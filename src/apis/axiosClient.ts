// apis/axiosClient.ts
import axios, { type InternalAxiosRequestConfig } from 'axios';
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

// 👉 log request dưới dạng CURL (bỏ Authorization để an toàn)
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = (config.method ?? 'get').toUpperCase();
  let url = (config.baseURL ?? '') + (config.url ?? '');

  if (config.params) {
    const qp = new URLSearchParams(config.params as any).toString();
    if (qp) {
      url += (url.includes('?') ? '&' : '?') + qp;
    }
  }

  const headerParts =
    config.headers &&
    Object.entries(config.headers)
      .filter(([key]) => key.toLowerCase() !== 'authorization')
      .map(([key, val]) => `-H "${key}: ${val}"`)
      .join(' ');

  let data = '';
  if (config.data) {
    const body =
      typeof config.data === 'string'
        ? config.data
        : JSON.stringify(config.data);
    data = `--data '${body}'`;
  }

  const curlCommand = `curl -X ${method} "${url}" ${headerParts} ${data}`.trim();
  console.log('[CURL]', curlCommand);

  return config;
});

// 👉 log response
axiosClient.interceptors.response.use(
  (response) => {
    console.log('[RESPONSE]', response.data);
    return response;
  },
  (error) => {
    if (error?.response) {
      console.error('[RESPONSE ERROR]', error.response.data);
    } else {
      console.error('[RESPONSE ERROR]', error);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
