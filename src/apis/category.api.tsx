import apiContant from '../constant/apiURL';
import type { ICategory } from '../types/categories.type';
import axiosClient from './axiosClient';

export interface CategoryParams {
    page: number;
    limit: number;
    sortBy?: string;
    searchBy?: string;
    value?: string;
}

export const categoriesApi = {
    getAll: (params: CategoryParams) =>
        axiosClient.get(apiContant.categories.init, {
            params
        }),
    getById: (id: string) => axiosClient.get(apiContant.categories.id(id)),
    update: (id: string, value: ICategory) => axiosClient.put(apiContant.categories.id(id), value),
    delete: (id: string) => axiosClient.delete(apiContant.categories.id(id)),
    create: (value: ICategory) => axiosClient.post(apiContant.categories.init, value),
};

// createBulk: (values: CreateCategoryDto[]) =>
// axiosClient.post(apiContant.categories.bulk, { categories: values }),
