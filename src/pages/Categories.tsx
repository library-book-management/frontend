import type { CreateCategoryDto, ICategory, BulkFormValues } from '../types/categories.type';
import { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Table, Pagination } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { categoriesApi } from '../apis/category.api';

const Categories = () => {
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ICategory | null>(
    null
  );

  const { register, handleSubmit, reset } = useForm<Partial<ICategory>>();

  const bulkForm = useForm<BulkFormValues>({
    defaultValues: { categories: [{ name: '' }] },
  });
  const { fields, append, remove } = useFieldArray({
    control: bulkForm.control,
    name: 'categories',
  });

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const loadCategories = useCallback(
    async (pageNum = page) => {
      try {
        const res = await categoriesApi.getAll({ page: pageNum, limit });
        setCategoryList(res?.data?.categories || []);
        setTotal(res?.data?.totalResults || 0);
      } catch {
        toast.error('Lỗi không thể lấy danh sách thể loại');
      }
    },
    [page, limit]
  );

  useEffect(() => {
    loadCategories(page);
  }, [loadCategories, page]);

  const openCreate = () => {
    reset({ name: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openCreateBulk = () => {
    bulkForm.reset({ categories: [{ name: '' }] });
    setShowBulkModal(true);
  };

  const openEdit = (category: ICategory) => {
    reset({
      name: category.name,
    });
    setEditingId(category._id);
    setShowModal(true);
  };

  const openDelete = (category: ICategory) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      await categoriesApi.delete(deletingCategory._id);
      toast.success('Xoá thành công');
      loadCategories(page);
    } catch {
      toast.error('Không thể xoá');
    } finally {
      setShowDeleteModal(false);
      setDeletingCategory(null);
    }
  };

  const onSubmit = async (data: Partial<ICategory>) => {
    try {
      if (!data) return;
      if (editingId) {
        await categoriesApi.update(editingId, data);
        toast.success('Cập nhật thành công');
      } else {
        await categoriesApi.create(data as CreateCategoryDto);
        toast.success('Tạo mới thành công');
      }
      setShowModal(false);
      loadCategories(page);
    } catch {
      toast.error('Lỗi khi lưu thể loại');
    }
  };

  const onSubmitBulk = async (data: BulkFormValues) => {
    try {
      const validData = data.categories.filter(
        (c) => c.name && c.name.trim() !== ''
      );
      if (validData.length === 0) {
        toast.error('Vui lòng nhập ít nhất 1 thể loại');
        return;
      }
      await categoriesApi.createBulk(validData as CreateCategoryDto[]);
      toast.success(`Tạo mới ${validData.length} thể loại thành công`);
      setShowBulkModal(false);
      loadCategories(page);
    } catch {
      toast.error('Lỗi khi tạo nhiều thể loại');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="mb-3 text-2xl font-bold">Danh sách thể loại</h1>
        <div>
          <Button onClick={openCreate} variant="primary" className="mb-3">
            Thêm thể loại
          </Button>
          <Button
            onClick={openCreateBulk}
            variant="primary"
            className="mb-3 ms-2"
          >
            Thêm nhiều thể loại
          </Button>
        </div>
      </div>
      <p className="text-muted">
        Tổng số thể loại: <strong>{total}</strong>
      </p>

      <Table bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Số lượng sách</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.map((category, index) => (
            <tr key={category._id}>
              <td>{(page - 1) * limit + index + 1}</td>
              <td>{category.name}</td>
              <td>
                {/* Tạm để trống, sau này thay dữ liệu vào 
              /// TODO: Thêm API lấy số lượng sách theo thể loại */}
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => openEdit(category)}
                  className="me-2"
                  title="Sửa"
                >
                  <BsPencilSquare className="text-white" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => openDelete(category)}
                  title="Xoá"
                >
                  <BsTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination từ react-bootstrap */}
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

      {/* Modal tạo/sửa */}
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? 'Sửa thể loại' : 'Tạo mới thể loại'}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Tên</label>
              <input
                {...register('name', { required: true })}
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
      {/* Modal tạo nhiều */}
      <Modal
        show={showBulkModal}
        centered
        onHide={() => setShowBulkModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo nhiều thể loại</Modal.Title>
        </Modal.Header>
        <form onSubmit={bulkForm.handleSubmit(onSubmitBulk)}>
          <Modal.Body>
            {fields.map((field, index) => (
              <div key={field.id} className="mb-2 d-flex align-items-center">
                <input
                  {...bulkForm.register(`categories.${index}.name`, {
                    required: true,
                  })}
                  className="form-control me-2"
                  placeholder={`Tên thể loại #${index + 1}`}
                />
                {fields.length > 1 && (
                  <Button variant="danger" onClick={() => remove(index)}>
                    X
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="secondary"
              className="mt-2"
              onClick={() => append({ name: '' })}
            >
              + Thêm dòng
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
              Huỷ
            </Button>
            <Button variant="primary" type="submit">
              Tạo mới
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
          Bạn có chắc chắn muốn xoá thể loại{' '}
          <strong>{deletingCategory?.name}</strong> không?
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

export default Categories;
