const apiContant = {
  authors: {
    init: '/authors',
    id: (id: string) => `/authors/${id}`,
  },
  categories: {
    init: '/categories',
    bulk: '/categories/bulk',
    id: (id: string) => `/categories/${id}`,
  },
  book: {
    init: '/books',
    id: (id: string) => `/books/${id}`,
  },
};

export default apiContant;
