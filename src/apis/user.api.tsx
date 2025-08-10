import axiosClient from './axiosClient';
import type { User } from '../types/user.type';

export interface Params {
  keyword?: string;
  page: number;
  limit: number;
}

const userApi = {
  // Lấy danh sách người dùng (có thể thêm params: page, limit, search...)
  getUsersByConditions: (params: Params) =>
    axiosClient.get('/users', { params }),

  // Lấy chi tiết 1 user theo id
  getUserById: (id: string) => axiosClient.get(`/users/${id}`),

  // Tạo mới user
  createUser: (data: User) => axiosClient.post('/users', data),

  // Cập nhật user
  updateUserById: (id: string, data: User) =>
    axiosClient.put(`/users/${id}`, data),

  // Xóa user
  delete: (id: string) => axiosClient.delete(`/users/${id}`),
};

export default userApi;
