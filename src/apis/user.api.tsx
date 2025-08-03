import axiosClient from './axiosClient';

export const userApi = {
  getAll: () => axiosClient.get('/users'),
};
