import type { CreateBookDto, IBook } from '../types/book.type';
import { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Table, Pagination } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { booksApi } from '../apis/book.api';
import { authorsApi } from '../apis/author.api';
// import { publishersApi } from '../apis/publisher.api';
import { categoriesApi } from '../apis/category.api';

const Books = () => {
  const [bookList, setBookList] = useState<IBook[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingBook, setDeletingBook] = useState<IBook | null>(null);
  const [authors, setAuthors] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const { register, handleSubmit, reset, control } = useForm<Partial<IBook>>();
  const { fields } = useFieldArray({
    control,
    name: 'category_id',
  });
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const loadBooks = useCallback(
    async (pageNum = page) => {
      try {
        const res = await booksApi.getAll({ page: pageNum, limit });
        setBookList(res?.data?.books || []);
        setTotal(res?.data?.totalResults || 0);
      } catch {
        toast.error('Lỗi không thể lấy danh sách sách');
      }
    },
    [page, limit]
  );

  useEffect(() => {
    loadBooks(page);
  }, [loadBooks, page]);

  // Lấy danh sách khi mở modal
  useEffect(() => {
    if (showModal) {
      authorsApi
        .getAll({ page: 1, limit: 10 })
        .then((res) => setAuthors(res?.data || []));
      // publishersApi
      //   .getAll({ page: 1, limit: 10 })
      //   .then((res) => setPublishers(res?.data || []));
      categoriesApi
        .getAll({ page: 1, limit: 10 })
        .then((res) => setCategories(res?.data || []));
    }
  }, [showModal]);

  const openCreate = () => {
    reset({
      title: '',
      author_id: [],
      category_id: [],
      publisher_id: [],
      year_published: 0,
      isbn: '',
      quantity: 0,
      price: 0,
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (book: IBook) => {
    reset({
      title: book.title,
      author_id: book.author_id,
      category_id: book.category_id,
      publisher_id: book.publisher_id,
      year_published: book.year_published,
      isbn: book.isbn,
      quantity: book.quantity,
      price: book.price,
    });
    setEditingId(book._id);
    setShowModal(true);
  };

  const openDelete = (book: IBook) => {
    setDeletingBook(book);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBook) return;
    try {
      await booksApi.delete(deletingBook._id);
      toast.success('Xoá thành công');
      loadBooks(page);
    } catch {
      toast.error('Không thể xoá');
    } finally {
      setShowDeleteModal(false);
      setDeletingBook(null);
    }
  };

  const onSubmit = async (data: Partial<IBook>) => {
    try {
      if (!data) return;
      if (editingId) {
        await booksApi.update(editingId, data);
        toast.success('Cập nhật thành công');
      } else {
        await booksApi.create(data as CreateBookDto);
        toast.success('Tạo mới thành công');
      }
      setShowModal(false);
      loadBooks(page);
    } catch {
      toast.error('Lỗi khi lưu sách');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="mb-3 text-2xl font-bold">Danh sách sách</h1>
        <div>
          <Button onClick={openCreate} variant="primary" className="mb-3">
            Thêm sách
          </Button>
        </div>
      </div>
      <p className="text-muted">
        Tổng số sách: <strong>{total}</strong>
      </p>

      <Table bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sách</th>
            <th>Tên tác giả</th>
            <th>Nhà xuất bản</th>
            <th>Thể loại</th>
            <th>Giá</th>
            <th>Số lượng sách</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookList.map((book, index) => (
            <tr key={book._id}>
              <td>{(page - 1) * limit + index + 1}</td>
              <td>{book.title}</td>
              <td>{book.author_id[0]?.name}</td>
              <td>{book.publisher_id}</td>
              <td>{book.category_id[0]?.name}</td>
              <td>{book.price}</td>
              <td>{book.quantity}</td>

              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => openEdit(book)}
                  className="me-2"
                  title="Sửa"
                >
                  <BsPencilSquare className="text-white" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => openDelete(book)}
                  title="Xoá"
                >
                  <BsTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center mt-3">
        <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
        <Pagination.Prev
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        />

        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === page}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
        />
        <Pagination.Last
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        />
      </Pagination>

      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Sửa sách' : 'Tạo mới sách'}</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Tên sách</label>
              <input
                {...register('title', { required: true })}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tác giả (có thể chọn nhiều)</label>
              <select
                {...register('author_id', { required: true })}
                className="form-control"
                multiple
              >
                {authors.map((author) => (
                  <option key={author._id} value={author._id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Nhà xuất bản</label>
              <select
                {...register('publisher_id', { required: true })}
                className="form-control"
              >
                <option value="">Chọn nhà xuất bản</option>
                {publishers.map((pub) => (
                  <option key={pub._id} value={pub._id}>
                    {pub.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Thể loại (có thể chọn nhiều)</label>
              <select
                {...register('category_id', { required: true })}
                className="form-control"
                multiple
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Giá</label>
              <input
                {...register('price', { required: true })}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Số lượng sách</label>
              <input
                {...register('quantity', { required: true })}
                className="form-control"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Huỷ
            </Button>
            <Button variant="primary" type="submit">
              {editingId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Modal xác nhận xoá */}
      <Modal
        show={showDeleteModal}
        centered
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xoá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xoá sách <strong>{deletingBook?.title}</strong>{' '}
          không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Huỷ
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Xoá
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Books;
