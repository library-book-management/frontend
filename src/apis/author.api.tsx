import apiContant from '../constant/apiURL';
import type { IAuthor } from '../types/authors.type';
import axiosClient from './axiosClient';

export interface AuthorParams {
    page: number;
    limit: number;
    sortBy?: string;
    searchBy?: string;
    value?: string;
}

export const authorsApi = {
    getAll: (params: AuthorParams) =>
        axiosClient.get(apiContant.authors.init, {
            params
        }),
    getById: (id: string) => axiosClient.get(apiContant.authors.id(id)),
    update: (id: string, value: IAuthor) => axiosClient.put(apiContant.authors.id(id), value),
    delete: (id: string) => axiosClient.delete(apiContant.authors.id(id)),
    create: (value: IAuthor) => axiosClient.post(apiContant.authors.init, value),
};
