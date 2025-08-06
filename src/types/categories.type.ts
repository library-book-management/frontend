export interface ICategory {
    _id: string;
    name: string;
}
export interface BulkFormValues {
  categories: Partial<ICategory>[];
}

export type CreateCategoryDto = Omit<ICategory, "_id">;
export type UpdateCategoryDto = Partial<Omit<ICategory, "_id">>;
