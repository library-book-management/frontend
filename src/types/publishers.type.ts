export interface IPublishers {
    _id?: string;
    name: string;
}

export const PUBLISHER_MODAL_TYPE = {
  CREATE: 'create',
  UPDATE: 'update',
} as const;

export type PublisherModalType =
  (typeof PUBLISHER_MODAL_TYPE)[keyof typeof PUBLISHER_MODAL_TYPE];
