export interface IAuthor {
    _id: string;
    name: string;
    phone: string;
    email: string;
}


export type CreateAuthorDto = Omit<IAuthor, "_id">;
export type UpdateAuthorDto = Partial<Omit<IAuthor, "_id">>;
