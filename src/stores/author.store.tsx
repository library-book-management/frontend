import { create } from 'zustand';
import type { IAuthor } from '../types/authors.type';
import { authorsApi, type AuthorParams } from '../apis/author.api';

interface AuthorState {
  author: IAuthor | null;
  authors: IAuthor[] | null;
  message: string | null;

  setAuthor: (author: IAuthor | null) => void;
  setAuthors: (authors: IAuthor[] | null) => void;

  getAuthorsByConditions: (params: AuthorParams) => Promise<void>;
  getAuthorById: (authorId: string) => Promise<void>;
  deleteAuthorById: (authorId: string) => Promise<void>;
  updateAuthorById: (authorId: string, data: IAuthor) => Promise<void>;
  createAuthor: (data: IAuthor) => Promise<void>;
}

export const useAuthorStore = create<AuthorState>((set) => ({
  author: null,
  authors: null,
  message: null,

  setAuthor: (author) => set({ author }),
  setAuthors: (authors) => set({ authors }),

  getAuthorsByConditions: async (params: AuthorParams) => {
    try {
      const response = await authorsApi.getAll(params);
      set({ authors: response.data.authors, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  getAuthorById: async (authorId: string) => {
    try {
      const response = await authorsApi.getById(authorId);
      set({ author: response.data.author, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  updateAuthorById: async (authorId: string, data: IAuthor) => {
    try {
      const response = await authorsApi.update(authorId, data);
      set({ author: response.data.author, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  createAuthor: async (data: IAuthor) => {
    try {
      const response = await authorsApi.create(data);
      set({ author: response.data.author, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  deleteAuthorById: async (authorId: string) => {
    try {
      const response = await authorsApi.delete(authorId);
      set({ author: response.data.author, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },
}));
