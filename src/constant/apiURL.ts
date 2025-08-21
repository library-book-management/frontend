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
  publishers: {
    init: '/publishers',
    id: (id: string) => `/publishers/${id}`,
  },
};

export default apiContant;
