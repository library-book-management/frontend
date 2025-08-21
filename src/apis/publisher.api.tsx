import apiContant from '../constant/apiURL';
import type { IPublishers } from '../types/publishers.type';
import axiosClient from './axiosClient';

export interface PublisherParams {
    page: number;
    limit: number;
    sortBy?: string;
    searchBy?: string;
    value?: string;
}

export const publishersApi = {
    getAll: (params: PublisherParams) =>
        axiosClient.get(apiContant.publishers.init, {
            params
        }),
    getById: (id: string) => axiosClient.get(apiContant.publishers.id(id)),
    update: (id: string, value: IPublishers) => axiosClient.put(apiContant.publishers.id(id), value),
    delete: (id: string) => axiosClient.delete(apiContant.publishers.id(id)),
    create: (value: IPublishers) => axiosClient.post(apiContant.publishers.init, value),
};
