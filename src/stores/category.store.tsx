import { create } from 'zustand';
import type { ICategory } from '../types/categories.type';
import { categoriesApi, type CategoryParams } from '../apis/category.api';

interface CategoryState {
  category: ICategory | null;
  categories: ICategory[] | null;
  message: string | null;

  setCategory: (category: ICategory | null) => void;
  setCategories: (categories: ICategory[] | null) => void;

  getCategoriesByConditions: (params: CategoryParams) => Promise<void>;
  getCategoryById: (categoryId: string) => Promise<void>;
  deleteCategoryById: (categoryId: string) => Promise<void>;
  updateCategoryById: (categoryId: string, data: ICategory) => Promise<void>;
  createCategory: (data: ICategory) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  category: null,
  categories: null,
  message: null,

  setCategory: (category) => set({ category }),
  setCategories: (categories) => set({ categories }),

  getCategoriesByConditions: async (params: CategoryParams) => {
    try {
      const response = await categoriesApi.getAll(params);
      set({ categories: response.data.categories, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  getCategoryById: async (categoryId: string) => {
    try {
      const response = await categoriesApi.getById(categoryId);
      set({ category: response.data.categories, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  updateCategoryById: async (categoryId: string, data: ICategory) => {
    try {
      const response = await categoriesApi.update(categoryId, data);
      set({ category: response.data.categories, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  createCategory: async (data: ICategory) => {
    try {
      const response = await categoriesApi.create(data);
      set({ category: response.data.categories, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },

  deleteCategoryById: async (categoryId: string) => {
    try {
      const response = await categoriesApi.delete(categoryId);
      set({ category: response.data.categories, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data?.message || error;
    }
  },
}));
