import { create } from 'zustand';
import { publishersApi, type PublisherParams } from '../apis/publisher.api';
import type { IPublishers } from '../types/publishers.type';

interface PublisherState {
  publisher: IPublishers | null;
  publishers: IPublishers[] | null;
  message: string | null;

  setPublisher: (publisher: IPublishers | null) => void;
  setPublishers: (publishers: IPublishers[] | null) => void;

  getPublishersByConditions: (params: PublisherParams) => Promise<void>;
  getPublisherById: (publisherId: string) => Promise<void>;
  deletePublisherById: (publisherId: string) => Promise<void>;
  updatePublisherById: (publisherId: string, data: IPublishers) => Promise<void>;
  createPublisher: (data: IPublishers) => Promise<void>;
}

export const usePublisherStore = create<PublisherState>((set) => ({
  publisher: null,
  publishers: null,
  message: null,

  setPublisher: (publisher) => set({ publisher }),
  setPublishers: (publishers) => set({ publishers }),

  getPublishersByConditions: async (params: PublisherParams) => {
    try {
      const response = await publishersApi.getAll(params);
      set({ publishers: response.data.publishers, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  getPublisherById: async (publisherId: string) => {
    try {
      const response = await publishersApi.getById(publisherId);
      set({ publisher: response.data.publisher, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  updatePublisherById: async (publisherId: string, data: IPublishers) => {
    try {
      const response = await publishersApi.update(publisherId, data);
      set({ publisher: response.data.publisher, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  createPublisher: async (data: IPublishers) => {
    try {
      const response = await publishersApi.create(data);
      set({ publisher: response.data.publisher, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  deletePublisherById: async (publisherId: string) => {
    try {
      const response = await publishersApi.delete(publisherId);
      set({ publisher: response.data.publisher, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },
}));
