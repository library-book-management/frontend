import { create } from 'zustand';
import { booksApi } from '../apis/book.api';
import type { IBook, CreateBookDto } from '../types/book.type';

interface bookState {
  book: IBook | null;
  books: IBook[] | null;
  message: string | null;
  setBook: (book: IBook | null) => void;
  setBooks: (books: IBook[] | null) => void;
  getBooks: (params?: any) => Promise<void>;
  getBookById: (bookId: string) => Promise<void>;
  updateBookById: (bookId: string, data: Partial<IBook>) => Promise<void>;
  createBook: (data: CreateBookDto) => Promise<void>;
  deleteBookById: (bookId: string) => Promise<void>;
}

export const useBookStore = create<bookState>((set) => ({
  book: null,
  books: null,
  message: null,
  setBook: (book) => set({ book }),
  setBooks: (books) => set({ books }),

  getBooks: async (params?: any) => {
    try {
      const response = await booksApi.getAll(params || {});
      set({ books: response.data.books, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getBookById: async (bookId: string) => {
    try {
      const response = await booksApi.getById(bookId);
      set({ book: response.data.book, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  updateBookById: async (bookId: string, data: Partial<IBook>) => {
    try {
      const response = await booksApi.update(bookId, data);
      set({ book: response.data.book, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  createBook: async (data: CreateBookDto) => {
    try {
      const response = await booksApi.create(data);
      set({ book: response.data.book, message: response.data.message });
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  deleteBookById: async (bookId: string) => {
    try {
      const response = await booksApi.delete(bookId);
      set({
        books: response.data.books,
        message: response.data.message,
      });
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
}));
