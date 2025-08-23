import type { IAuthor } from './authors.type';
import type { ICategory } from './categories.type';
import type { IPublishers } from './publishers.type';

export interface IBook {
  _id: string;
  title: string;
  author_id: IAuthor[];
  category_id: ICategory[];
  publisher_id: IPublishers[];
  year_published: number;
  isbn: string;
  quantity: number;
  price: number;
}
export interface BulkFormValues {
  books: Partial<IBook>[];
}
export type CreateBookDto = Omit<IBook, '_id'>;
export type UpdateBookDto = Partial<Omit<IBook, '_id'>>;

export const BOOK_MODAL_TYPE = {
  CREATE: 'create',
  UPDATE: 'update',
} as const;

export const OBJECT_TYPE = {
  USER: 'user',
  AUTHOR: 'author',
  CATEGORY: 'category',
  BOOK: 'book',
  PUBLISHER: 'publisher',
} as const;

export type BookModalType =
  (typeof BOOK_MODAL_TYPE)[keyof typeof BOOK_MODAL_TYPE];

export type ObjectType = (typeof OBJECT_TYPE)[keyof typeof OBJECT_TYPE];
