import apiContant from '../constant/apiURL';
import type { CreateAuthorDto, UpdateAuthorDto } from '../types/authors.type';
import axiosClient from './axiosClient';

export const authorsApi = {
    getAll: () => axiosClient.get(apiContant.authors.init),
    update: (id: string, value: UpdateAuthorDto) => axiosClient.put(apiContant.authors.id(id), value),
    delete: (id: string) => axiosClient.delete(apiContant.authors.id(id)),
    create: (value: CreateAuthorDto) => axiosClient.post(apiContant.authors.init, value),
};
