export interface IAuthor {
    _id?: string;
    name: string;
    phone: string;
    email: string;
}

export const AUTHOR_MODAL_TYPE = {
  CREATE: 'create',
  UPDATE: 'update',
} as const;

export type AuthorModalType =
  (typeof AUTHOR_MODAL_TYPE)[keyof typeof AUTHOR_MODAL_TYPE];
