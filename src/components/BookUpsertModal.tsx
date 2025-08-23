import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import type { IBook, CreateBookDto } from '../types/book.type';
import { useBookStore } from '../stores/book.store';
import { authorsApi } from '../apis/author.api';
import { publishersApi } from '../apis/publisher.api';
import { categoriesApi } from '../apis/category.api';

interface BookUpsertModalProps {
  show: boolean;
  onCloseModal: () => void;
  onSubmit?: (data: CreateBookDto | Partial<IBook>) => void;
  initialData?: Partial<IBook>;
  loading?: boolean;
  title?: string;
  bookId?: string | string[];
  type: 'CREATE' | 'UPDATE';
  loadBooks?: () => void;
}

const BookUpsertModal: React.FC<BookUpsertModalProps> = ({
  show,
  onCloseModal,
  onSubmit,
  initialData,
  loading,
  title,
  bookId,
  type,
  loadBooks,
}) => {
  const { getBookById, createBook, updateBookById } = useBookStore();
  const [fetching, setFetching] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Partial<IBook>>();

  // Watch selected values
  const watchedAuthorIds = watch('author_id', []);
  const watchedCategoryIds = watch('category_id', []);

  // State lưu danh sách
  const [authors, setAuthors] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Debug function
  const debugApiResponse = (name: string, response: any) => {
    console.log(`=== ${name} API Response ===`);
    console.log('Full response:', response);
    console.log('Response.data:', response?.data);
    console.log('Is array:', Array.isArray(response?.data));
    console.log('Length:', response?.data?.length);
  };

  // Lấy danh sách khi mở modal với debug
  useEffect(() => {
    if (show) {
      setLoadingData(true);
      console.log('=== Loading modal data ===');

      // Load authors
      authorsApi
        .getAll({ page: 1, limit: 100 })
        .then((res) => {
          debugApiResponse('Authors', res);
          const authorsData = res?.data || res || [];
          setAuthors(Array.isArray(authorsData) ? authorsData : []);
        })
        .catch((err) => {
          console.error('❌ Authors API Error:', err);
          setAuthors([]);
        });

      // Load publishers
      publishersApi
        .getAll({ page: 1, limit: 100 })
        .then((res) => {
          debugApiResponse('Publishers', res);
          const publishersData = res?.data || res || [];
          setPublishers(Array.isArray(publishersData) ? publishersData : []);
        })
        .catch((err) => {
          console.error('❌ Publishers API Error:', err);
          setPublishers([]);
        });

      // Load categories with enhanced debugging
      categoriesApi
        .getAll({ page: 1, limit: 100 })
        .then((res) => {
          debugApiResponse('Categories', res);

          let categoriesData = [];

          if (res?.data) {
            categoriesData = res.data;
          } else if (res?.data?.categories) {
            categoriesData = res.data.categories;
          } else if (Array.isArray(res)) {
            categoriesData = res;
          } else {
            console.warn('⚠️ Unknown categories response structure');
            categoriesData = [];
          }

          console.log('📊 Final categories data:', categoriesData);
          setCategories(
            Array.isArray(categoriesData.categories)
              ? categoriesData.categories
              : []
          );
        })
        .catch((err) => {
          console.error('❌ Categories API Error:', err);
          console.error('Error details:', {
            message: err.message,
            status: err.status,
            response: err.response,
          });
          setCategories([]);
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [show]);

  // Mock data fallback for testing (remove this in production)
  useEffect(() => {
    if (
      show &&
      categories.length === 0 &&
      authors.length === 0 &&
      publishers.length === 0
    ) {
      console.log('🧪 Using mock data for testing...');
      setTimeout(() => {
        setAuthors([
          { _id: '1', name: 'Nguyễn Nhật Ánh' },
          { _id: '2', name: 'Tô Hoài' },
          { _id: '3', name: 'Nam Cao' },
        ]);
        setPublishers([
          { _id: '1', name: 'NXB Kim Đồng' },
          { _id: '2', name: 'NXB Trẻ' },
          { _id: '3', name: 'NXB Văn học' },
        ]);
        setCategories([
          { _id: '1', name: 'Văn học thiếu nhi' },
          { _id: '2', name: 'Tiểu thuyết' },
          { _id: '3', name: 'Khoa học' },
          { _id: '4', name: 'Lịch sử' },
        ]);
        setLoadingData(false);
      }, 2000);
    }
  }, [show, categories.length, authors.length, publishers.length]);

  // Lấy dữ liệu sách khi update
  useEffect(() => {
    if (type === 'UPDATE' && bookId && show) {
      setFetching(true);
      const id = Array.isArray(bookId) ? bookId[0] : bookId;
      getBookById(id)
        .then(() => setFetching(false))
        .catch((err) => {
          console.error('Error loading book:', err);
          setFetching(false);
        });
    }
  }, [type, bookId, show, getBookById]);

  // Reset form
  useEffect(() => {
    if (type === 'UPDATE' && initialData) {
      const authorIds = Array.isArray(initialData.author_id)
        ? initialData.author_id?.map((a) =>
            typeof a === 'object' && a._id ? a._id : a
          )
        : initialData.author_id
          ? [initialData.author_id]
          : [];

      const categoryIds = Array.isArray(initialData.category_id)
        ? initialData.category_id?.map((c) =>
            typeof c === 'object' && c._id ? c._id : c
          )
        : initialData.category_id
          ? [initialData.category_id]
          : [];

      const publisherId = Array.isArray(initialData.publisher_id)
        ? initialData.publisher_id[0] &&
          typeof initialData.publisher_id[0] === 'object'
          ? initialData.publisher_id[0]._id
          : initialData.publisher_id[0]
        : initialData.publisher_id;

      reset({
        ...initialData,
        author_id: authorIds,
        category_id: categoryIds,
        publisher_id: publisherId,
      });

      // Set values explicitly for multiple selects
      setValue('author_id', authorIds);
      setValue('category_id', categoryIds);
    } else if (type === 'CREATE') {
      const defaultValues = {
        title: '',
        author_id: [],
        category_id: [],
        publisher_id: '',
        year_published: new Date().getFullYear(),
        isbn: '',
        quantity: 1,
        price: 0,
      };
      reset(defaultValues);
      setValue('author_id', []);
      setValue('category_id', []);
    }
  }, [initialData, reset, setValue, show, type]);

  // Submit handler
  const handleUpsert = async (data: Partial<IBook>) => {
    try {
      console.log('📝 Form data before processing:', data);

      // Helper function to process select values
      const processSelectValues = (value: any): string[] => {
        if (!value) return [];

        // If it's already an array
        if (Array.isArray(value)) {
          return value
            .filter((v) => v !== undefined && v !== '')
            .map((v) => String(v));
        }

        // If it's a string that looks like "[ '1', '2' ]"
        if (typeof value === 'string') {
          try {
            // Try to parse if it's JSON-like
            if (value.startsWith('[') && value.endsWith(']')) {
              const parsed = JSON.parse(value.replace(/'/g, '"'));
              return Array.isArray(parsed)
                ? parsed.map((v) => String(v))
                : [String(value)];
            }
            return [String(value)];
          } catch {
            return [String(value)];
          }
        }

        return [String(value)];
      };

      const submitData = {
        title: data.title,
        author_id: processSelectValues(data.author_id),
        category_id: processSelectValues(data.category_id),
        publisher_id: String(data.publisher_id || ''), // Single value, not array
        year_published: Number(data.year_published),
        isbn: String(data.isbn),
        quantity: Number(data.quantity),
        price: Number(data.price),
      };

      // Validate required fields
      if (!submitData.title) throw new Error('Tên sách là bắt buộc');
      if (!submitData.author_id || submitData.author_id.length === 0)
        throw new Error('Vui lòng chọn tác giả');
      if (!submitData.category_id || submitData.category_id.length === 0)
        throw new Error('Vui lòng chọn thể loại');
      if (!submitData.publisher_id)
        throw new Error('Vui lòng chọn nhà xuất bản');
      if (!submitData.isbn) throw new Error('ISBN là bắt buộc');

      if (type === 'UPDATE' && bookId) {
        const id = Array.isArray(bookId) ? bookId[0] : bookId;
        await updateBookById(id, submitData);
      } else {
        await createBook(submitData as CreateBookDto);
      }

      if (loadBooks) await loadBooks();
      onCloseModal();
    } catch (error) {
      console.error('💥 Error saving book:', error);
    }
  };

  return (
    <Modal show={show} centered onHide={onCloseModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {title || (type === 'UPDATE' ? 'Sửa sách' : 'Thêm sách')}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit(handleUpsert)}>
        <Modal.Body>
          {/* Debug info - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="alert alert-info small mb-3">
              <strong>Debug Info:</strong>
              <br />
              Authors: {authors.length} | Publishers: {publishers.length} |
              Categories: {categories.length}
              {loadingData && <span> | Loading...</span>}
            </div>
          )}

          {fetching || loadingData ? (
            <div className="flex justify-center py-5">
              <Spinner animation="border" />
              <span className="ms-2">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Tên sách <span className="text-danger">*</span>
                </label>
                <input
                  {...register('title', { required: 'Tên sách là bắt buộc' })}
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  disabled={loading}
                  placeholder="Nhập tên sách"
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title.message}</div>
                )}
              </div>

              <div>
                <label className="form-label">
                  Tác giả <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control ${errors.author_id ? 'is-invalid' : ''}`}
                  multiple
                  disabled={loading}
                  style={{ minHeight: '120px' }}
                  value={watchedAuthorIds || []}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    console.log('Author selection changed:', values);
                    setValue('author_id', values, { shouldValidate: true });
                  }}
                >
                  {authors.length > 0 ? (
                    authors.map((author) => (
                      <option key={author._id} value={author._id}>
                        {author.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>
                      {loadingData ? 'Đang tải...' : 'Không có tác giả'}
                    </option>
                  )}
                </select>
                <small className="text-muted">
                  Giữ Ctrl để chọn nhiều tác giả
                </small>
                {(!watchedAuthorIds || watchedAuthorIds.length === 0) && (
                  <div className="invalid-feedback d-block">
                    Vui lòng chọn ít nhất một tác giả
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">
                  Nhà xuất bản <span className="text-danger">*</span>
                </label>
                <select
                  {...register('publisher_id', {
                    required: 'Vui lòng chọn nhà xuất bản',
                  })}
                  className={`form-control ${errors.publisher_id ? 'is-invalid' : ''}`}
                  disabled={loading}
                >
                  <option value="">Chọn nhà xuất bản</option>
                  {publishers.length > 0
                    ? publishers.map((pub) => (
                        <option key={pub._id} value={pub._id}>
                          {pub.name}
                        </option>
                      ))
                    : !loadingData && (
                        <option disabled>Không có nhà xuất bản</option>
                      )}
                </select>
              </div>

              <div>
                <label className="form-label">
                  Thể loại <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control ${errors.category_id ? 'is-invalid' : ''}`}
                  multiple
                  disabled={loading}
                  style={{ minHeight: '120px' }}
                  value={watchedCategoryIds || []}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    console.log('Category selection changed:', values);
                    setValue('category_id', values, { shouldValidate: true });
                  }}
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>
                      {loadingData
                        ? 'Đang tải thể loại...'
                        : 'Không có thể loại'}
                    </option>
                  )}
                </select>
                <small className="text-muted">
                  Giữ Ctrl để chọn nhiều thể loại
                  {categories.length > 0 &&
                    ` (${categories.length} thể loại có sẵn)`}
                </small>
                {(!watchedCategoryIds || watchedCategoryIds.length === 0) && (
                  <div className="invalid-feedback d-block">
                    Vui lòng chọn ít nhất một thể loại
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">
                  Năm xuất bản <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  {...register('year_published', {
                    required: 'Năm xuất bản là bắt buộc',
                    min: { value: 1000, message: 'Năm xuất bản không hợp lệ' },
                    max: {
                      value: new Date().getFullYear() + 1,
                      message: 'Năm không được vượt quá năm hiện tại',
                    },
                  })}
                  className={`form-control ${errors.year_published ? 'is-invalid' : ''}`}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="form-label">
                  ISBN <span className="text-danger">*</span>
                </label>
                <input
                  {...register('isbn', { required: 'ISBN là bắt buộc' })}
                  className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="form-label">
                  Giá (VND) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  {...register('price', {
                    required: 'Giá là bắt buộc',
                    min: { value: 0, message: 'Giá không thể âm' },
                  })}
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="form-label">
                  Số lượng <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  {...register('quantity', {
                    required: 'Số lượng là bắt buộc',
                    min: { value: 0, message: 'Số lượng không thể âm' },
                  })}
                  className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onCloseModal}
            disabled={loading || fetching || loadingData}
          >
            Huỷ
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading || fetching || loadingData}
          >
            {type === 'UPDATE' ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default BookUpsertModal;
