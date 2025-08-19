import type { IAuthor } from './authors.type';
import type { ICategory } from './categories.type';

export interface IBook {
  _id: string;
  title: string;
  author_id: IAuthor[];
  category_id: ICategory[];
  publisher_id: string[];
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
