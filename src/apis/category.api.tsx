import apiContant from '../constant/apiURL';
import type { CreateCategoryDto, UpdateCategoryDto } from '../types/categories.type';
import axiosClient from './axiosClient';

export const categoriesApi = {
    getAll: ({ limit, page }: { page: number, limit: number }) =>
        axiosClient.get(apiContant.categories.init, {
            params: { page, limit }
        }),
    update: (id: string, value: UpdateCategoryDto) => axiosClient.put(apiContant.categories.id(id), value),
    delete: (id: string) => axiosClient.delete(apiContant.categories.id(id)),
    create: (value: CreateCategoryDto) => axiosClient.post(apiContant.categories.init, value),
    createBulk: (values: CreateCategoryDto[]) =>
        axiosClient.post(apiContant.categories.bulk, { categories: values }),

};
