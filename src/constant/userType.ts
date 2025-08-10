export const USER_MODAL_TYPE = {
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

export type UserModalType =
  (typeof USER_MODAL_TYPE)[keyof typeof USER_MODAL_TYPE];

export type ObjectType = (typeof OBJECT_TYPE)[keyof typeof OBJECT_TYPE];
