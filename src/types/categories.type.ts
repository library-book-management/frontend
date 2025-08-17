export interface ICategory {
    _id?: string;
    name: string;
}

export const CATEGORY_MODAL_TYPE = {
  CREATE: 'create',
  UPDATE: 'update',
} as const;

export type CategoryModalType =
  (typeof CATEGORY_MODAL_TYPE)[keyof typeof CATEGORY_MODAL_TYPE];
