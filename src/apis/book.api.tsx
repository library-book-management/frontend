import apiContant from '../constant/apiURL';
import type { CreateBookDto, UpdateBookDto } from '../types/book.type';
import axiosClient from './axiosClient';

export const booksApi = {
  getAll: ({ limit, page }: { page: number; limit: number }) =>
    axiosClient.get(apiContant.book.init, {
      params: { page, limit },
    }),
  update: (id: string, value: UpdateBookDto) =>
    axiosClient.put(apiContant.book.id(id), value),
  delete: (id: string) => axiosClient.delete(apiContant.book.id(id)),
  create: (value: CreateBookDto) =>
    axiosClient.post(apiContant.book.init, value),
};
