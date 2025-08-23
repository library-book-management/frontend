import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import type { IBook, CreateBookDto } from '../types/book.type';
import type { IAuthor } from '../types/authors.type';
import type { ICategory } from '../types/categories.type';
import type { IPublishers } from '../types/publishers.type';
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

interface FormData {
  title: string;
  author_id: string[];
  category_id: string[];
  publisher_id: string;
  year_published: number;
  isbn: string;
  quantity: number;
  price: number;
}

const BookUpsertModal: React.FC<BookUpsertModalProps> = ({
  show,
  onCloseModal,
  initialData,
  title,
  bookId,
  type,
  loadBooks,
}) => {
  const { getBookById, createBook, updateBookById } = useBookStore();
  const [fetching, setFetching] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  // Watch selected values
  const watchedAuthorIds = watch('author_id', []);
  const watchedCategoryIds = watch('category_id', []);

  // State lưu danh sách
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [publishers, setPublishers] = useState<IPublishers[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [apiErrors, setApiErrors] = useState<{
    authors?: string;
    publishers?: string;
    categories?: string;
  }>({});

  // Helper function để extract data từ response
  const extractDataFromResponse = (response: any, dataKey?: string) => {
    console.log('🔍 Extracting data from response:', response);

    // Nếu response trực tiếp là array
    if (Array.isArray(response)) {
      console.log('✅ Response is direct array');
      return response;
    }

    // Nếu response.data là array
    if (response?.data && Array.isArray(response.data)) {
      console.log('✅ Response.data is array');
      return response.data;
    }

    // Nếu response.data có key cụ thể (như categories)
    if (
      dataKey &&
      response?.data?.[dataKey] &&
      Array.isArray(response.data[dataKey])
    ) {
      console.log(`✅ Response.data.${dataKey} is array`);
      return response.data[dataKey];
    }

    // Nếu response có key cụ thể
    if (dataKey && response?.[dataKey] && Array.isArray(response[dataKey])) {
      console.log(`✅ Response.${dataKey} is array`);
      return response[dataKey];
    }

    console.warn('⚠️ Could not extract array from response');
    return [];
  };

  // Lấy danh sách khi mở modal
  useEffect(() => {
    if (show) {
      setLoadingData(true);
      setApiErrors({});

      const loadAllData = async () => {
        console.log('=== Loading modal data ===');

        try {
          // Load authors
          console.log('📚 Loading authors...');
          const authorsResponse = await authorsApi.getAll({
            page: 1,
            limit: 100,
          });
          const authorsData = extractDataFromResponse(
            authorsResponse,
            'authors'
          );
          console.log('👥 Authors loaded:', authorsData);
          setAuthors(authorsData);
        } catch (error) {
          console.error('❌ Authors API Error:', error);
          setApiErrors((prev) => ({
            ...prev,
            authors: 'Không thể tải danh sách tác giả',
          }));
          setAuthors([]);
        }

        try {
          // Load publishers
          console.log('🏢 Loading publishers...');
          const publishersResponse = await publishersApi.getAll({
            page: 1,
            limit: 100,
          });
          const publishersData = extractDataFromResponse(
            publishersResponse,
            'publishers'
          );
          console.log('🏪 Publishers loaded:', publishersData);
          setPublishers(publishersData);
        } catch (error) {
          console.error('❌ Publishers API Error:', error);
          setApiErrors((prev) => ({
            ...prev,
            publishers: 'Không thể tải danh sách nhà xuất bản',
          }));
          setPublishers([]);
        }

        try {
          // Load categories
          console.log('📂 Loading categories...');
          const categoriesResponse = await categoriesApi.getAll({
            page: 1,
            limit: 100,
          });
          const categoriesData = extractDataFromResponse(
            categoriesResponse,
            'categories'
          );
          console.log('🏷️ Categories loaded:', categoriesData);
          setCategories(categoriesData);
        } catch (error) {
          console.error('❌ Categories API Error:', error);
          setApiErrors((prev) => ({
            ...prev,
            categories: 'Không thể tải danh sách thể loại',
          }));
          setCategories([]);
        }

        setLoadingData(false);
      };

      loadAllData();
    }
  }, [show]);

  // Load book data for update
  useEffect(() => {
    if (type === 'UPDATE' && bookId && show && !initialData) {
      setFetching(true);
      const id = Array.isArray(bookId) ? bookId[0] : bookId;

      getBookById(id)
        .then((bookData) => {
          console.log('📖 Book data loaded for update:', bookData);
          // Book data sẽ được handle trong useEffect tiếp theo thông qua initialData
        })
        .catch((err) => {
          console.error('❌ Error loading book:', err);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [type, bookId, show, getBookById, initialData]);

  // Reset form with proper data handling
  useEffect(() => {
    if (!show) return;

    if (
      type === 'UPDATE' &&
      initialData &&
      Object.keys(initialData).length > 0
    ) {
      console.log('🔄 Setting form data for update:', initialData);

      // Extract IDs from nested objects for authors
      const authorIds = Array.isArray(initialData.author_id)
        ? initialData.author_id
            .map((author) =>
              typeof author === 'object' && author !== null && '_id' in author
                ? author._id
                : String(author)
            )
            .filter(Boolean)
        : [];

      // Extract IDs from nested objects for categories
      const categoryIds = Array.isArray(initialData.category_id)
        ? initialData.category_id
            .map((category) =>
              typeof category === 'object' &&
              category !== null &&
              '_id' in category
                ? category._id
                : String(category)
            )
            .filter(Boolean)
        : [];

      let publisherId = '' as any;
      if (
        Array.isArray(initialData.publisher_id) &&
        initialData.publisher_id.length > 0
      ) {
        const publisher = initialData.publisher_id[0];
        publisherId =
          typeof publisher === 'object' &&
          publisher !== null &&
          '_id' in publisher
            ? publisher._id
            : String(publisher);
      } else if (initialData.publisher_id) {
        publisherId =
          typeof initialData.publisher_id === 'object' &&
          initialData.publisher_id !== null &&
          '_id' in initialData.publisher_id
            ? initialData.publisher_id._id
            : String(initialData.publisher_id);
      }

      const formData: FormData = {
        title: initialData.title || '',
        author_id: authorIds as any,
        category_id: categoryIds,
        publisher_id: publisherId,
        year_published: initialData.year_published || new Date().getFullYear(),
        isbn: initialData.isbn || '',
        quantity: initialData.quantity || 1,
        price: initialData.price || 0,
      };

      // Reset form với data
      reset(formData);

      // Explicitly set multi-select values sau khi form đã reset
      setTimeout(() => {
        setValue('author_id', authorIds as any);
        setValue('category_id', categoryIds);
      }, 100);
    } else if (type === 'CREATE') {
      const defaultValues: FormData = {
        title: '',
        author_id: [],
        category_id: [],
        publisher_id: '',
        year_published: new Date().getFullYear(),
        isbn: '',
        quantity: 1,
        price: 0,
      };

      console.log('🆕 Resetting form for CREATE mode');
      reset(defaultValues);
      setValue('author_id', []);
      setValue('category_id', []);
    }
  }, [
    initialData,
    reset,
    setValue,
    show,
    type,
    authors,
    categories,
    publishers,
  ]);

  // Submit handler
  const handleUpsert = async (data: FormData) => {
    setSubmitLoading(true);

    try {
      console.log('📝 Form data submitted:', data);

      // Validate required fields
      if (!data.title?.trim()) {
        throw new Error('Tên sách là bắt buộc');
      }
      if (!data.author_id || data.author_id.length === 0) {
        throw new Error('Vui lòng chọn ít nhất một tác giả');
      }
      if (!data.category_id || data.category_id.length === 0) {
        throw new Error('Vui lòng chọn ít nhất một thể loại');
      }
      if (!data.publisher_id) {
        throw new Error('Vui lòng chọn nhà xuất bản');
      }
      if (!data.isbn?.trim()) {
        throw new Error('ISBN là bắt buộc');
      }

      const submitData = {
        title: data.title.trim(),
        author_id: data.author_id.filter((id) => id && id.trim()),
        category_id: data.category_id.filter((id) => id && id.trim()),
        publisher_id: data.publisher_id,
        year_published: Number(data.year_published),
        isbn: data.isbn.trim(),
        quantity: Number(data.quantity),
        price: Number(data.price),
      };

      console.log('🚀 Submitting data:', submitData);

      if (type === 'UPDATE' && bookId) {
        const id = Array.isArray(bookId) ? bookId[0] : bookId;
        await updateBookById(id, submitData as any);
        console.log('✅ Book updated successfully');
      } else {
        await createBook(submitData as any);
        console.log('✅ Book created successfully');
      }

      // Reload books list
      if (loadBooks) {
        await loadBooks();
      }

      // Close modal
      onCloseModal();
    } catch (error) {
      console.error('💥 Error saving book:', error);
      // You might want to show an error toast/notification here
      alert(
        error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu sách'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const isLoading = fetching || loadingData || submitLoading;

  return (
    <Modal show={show} centered onHide={onCloseModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {title || (type === 'UPDATE' ? 'Cập nhật sách' : 'Thêm sách mới')}
        </Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit(handleUpsert)}>
        <Modal.Body>
          {/* Loading state */}
          {loadingData && (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Đang tải dữ liệu...</span>
            </div>
          )}

          {/* API Errors */}
          {Object.keys(apiErrors).length > 0 && (
            <div className="alert alert-warning mb-3">
              <strong>Cảnh báo:</strong>
              <ul className="mb-0 mt-1">
                {Object.values(apiErrors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {!loadingData && (
            <div className="row g-3">
              {/* Title */}
              <div className="col-md-6">
                <label className="form-label">
                  Tên sách <span className="text-danger">*</span>
                </label>
                <input
                  {...register('title', {
                    required: 'Tên sách là bắt buộc',
                    minLength: {
                      value: 1,
                      message: 'Tên sách không được để trống',
                    },
                  })}
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  disabled={isLoading}
                  placeholder="Nhập tên sách"
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title.message}</div>
                )}
              </div>

              {/* ISBN */}
              <div className="col-md-6">
                <label className="form-label">
                  ISBN <span className="text-danger">*</span>
                </label>
                <input
                  {...register('isbn', {
                    required: 'ISBN là bắt buộc',
                    minLength: {
                      value: 1,
                      message: 'ISBN không được để trống',
                    },
                  })}
                  className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
                  disabled={isLoading}
                  placeholder="Nhập mã ISBN"
                />
                {errors.isbn && (
                  <div className="invalid-feedback">{errors.isbn.message}</div>
                )}
              </div>

              {/* Authors */}
              <div className="col-md-6">
                <label className="form-label">
                  Tác giả <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control ${!watchedAuthorIds || watchedAuthorIds.length === 0 ? 'is-invalid' : ''}`}
                  multiple
                  disabled={isLoading}
                  size={6}
                  value={watchedAuthorIds || []}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    console.log('👥 Author selection changed:', values);
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
                      {apiErrors.authors
                        ? 'Lỗi tải dữ liệu'
                        : 'Không có tác giả'}
                    </option>
                  )}
                </select>
                <div className="form-text">
                  Giữ Ctrl (Cmd) để chọn nhiều tác giả. Đã chọn:{' '}
                  {watchedAuthorIds?.length || 0}
                </div>
                {(!watchedAuthorIds || watchedAuthorIds.length === 0) && (
                  <div className="invalid-feedback d-block">
                    Vui lòng chọn ít nhất một tác giả
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="col-md-6">
                <label className="form-label">
                  Thể loại <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control ${!watchedCategoryIds || watchedCategoryIds.length === 0 ? 'is-invalid' : ''}`}
                  multiple
                  disabled={isLoading}
                  size={6}
                  value={watchedCategoryIds || []}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    console.log('🏷️ Category selection changed:', values);
                    setValue('category_id', values, { shouldValidate: true });
                  }}
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>
                      {apiErrors.categories
                        ? 'Lỗi tải dữ liệu'
                        : 'Không có thể loại'}
                    </option>
                  )}
                </select>
                <div className="form-text">
                  Giữ Ctrl (Cmd) để chọn nhiều thể loại. Đã chọn:{' '}
                  {watchedCategoryIds?.length || 0}
                </div>
                {(!watchedCategoryIds || watchedCategoryIds.length === 0) && (
                  <div className="invalid-feedback d-block">
                    Vui lòng chọn ít nhất một thể loại
                  </div>
                )}
              </div>

              {/* Publisher */}
              <div className="col-md-6">
                <label className="form-label">
                  Nhà xuất bản <span className="text-danger">*</span>
                </label>
                <select
                  {...register('publisher_id', {
                    required: 'Vui lòng chọn nhà xuất bản',
                  })}
                  className={`form-control ${errors.publisher_id ? 'is-invalid' : ''}`}
                  disabled={isLoading}
                >
                  <option value="">-- Chọn nhà xuất bản --</option>
                  {publishers.length > 0 ? (
                    publishers.map((publisher) => (
                      <option key={publisher._id} value={publisher._id}>
                        {publisher.name}
                      </option>
                    ))
                  ) : !apiErrors.publishers ? (
                    <option disabled>Không có nhà xuất bản</option>
                  ) : null}
                </select>
                {errors.publisher_id && (
                  <div className="invalid-feedback">
                    {errors.publisher_id.message}
                  </div>
                )}
              </div>

              {/* Year Published */}
              <div className="col-md-6">
                <label className="form-label">
                  Năm xuất bản <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  {...register('year_published', {
                    required: 'Năm xuất bản là bắt buộc',
                    min: {
                      value: 1000,
                      message: 'Năm xuất bản phải từ 1000 trở lên',
                    },
                    max: {
                      value: new Date().getFullYear() + 5,
                      message: `Năm xuất bản không được vượt quá ${new Date().getFullYear() + 5}`,
                    },
                  })}
                  className={`form-control ${errors.year_published ? 'is-invalid' : ''}`}
                  disabled={isLoading}
                  min="1000"
                  max={new Date().getFullYear() + 5}
                />
                {errors.year_published && (
                  <div className="invalid-feedback">
                    {errors.year_published.message}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="col-md-6">
                <label className="form-label">
                  Giá bán (VNĐ) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  {...register('price', {
                    required: 'Giá bán là bắt buộc',
                    min: { value: 0, message: 'Giá bán không thể âm' },
                  })}
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  disabled={isLoading}
                  min="0"
                  step="1000"
                  placeholder="0"
                />
                {errors.price && (
                  <div className="invalid-feedback">{errors.price.message}</div>
                )}
              </div>

              {/* Quantity */}
              <div className="col-md-6">
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
                  disabled={isLoading}
                  min="0"
                  step="1"
                  placeholder="1"
                />
                {errors.quantity && (
                  <div className="invalid-feedback">
                    {errors.quantity.message}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onCloseModal}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading || loadingData}
          >
            {submitLoading && (
              <Spinner animation="border" size="sm" className="me-2" />
            )}
            {type === 'UPDATE' ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default BookUpsertModal;
