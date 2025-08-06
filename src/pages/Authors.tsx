import type { CreateAuthorDto, IAuthor } from "../types/authors.type";
import { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { authorsApi } from "../apis/author.api";

const Authors = () => {
  const [authorList, setAuthorList] = useState<IAuthor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingAuthor, setDeletingAuthor] = useState<IAuthor | null>(null);

  const { register, handleSubmit, reset } = useForm<Partial<IAuthor>>();

  const loadAuthors = async () => {
    try {
      const res = await authorsApi.getAll();
      setAuthorList(res?.data?.authors || []);
    } catch {
      toast.error("Lỗi không thể lấy danh sách tác giả");
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const openCreate = () => {
    reset({ name: "", phone: "", email: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (author: IAuthor) => {
    reset({
      name: author.name,
      phone: author.phone,
      email: author.email,
    });
    setEditingId(author._id);
    setShowModal(true);
  };

  const openDelete = (author: IAuthor) => {
    setDeletingAuthor(author);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAuthor) return;
    try {
      await authorsApi.delete(deletingAuthor._id);
      toast.success("Xoá thành công");
      loadAuthors();
    } catch {
      toast.error("Không thể xoá");
    } finally {
      setShowDeleteModal(false);
      setDeletingAuthor(null);
    }
  };

  const onSubmit = async (data: Partial<IAuthor>) => {
    try {
      if (!data) return;
      if (editingId) {
        await authorsApi.update(editingId, data);
        toast.success("Cập nhật thành công");
      } else {
        await authorsApi.create(data as CreateAuthorDto);
        toast.success("Tạo mới thành công");
      }
      setShowModal(false);
      loadAuthors();
    } catch {
      toast.error("Lỗi khi lưu tác giả");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="mb-3 text-2xl font-bold">Danh sách tác giả</h1>
        <Button onClick={openCreate} variant="primary" className="mb-3">
          Thêm tác giả
        </Button>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Tên</th>
            <th>SĐT</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {authorList.map((author) => (
            <tr key={author._id}>
              <td>{author.name}</td>
              <td>{author.phone}</td>
              <td>{author.email}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => openEdit(author)}
                  className="me-2"
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => openDelete(author)}
                >
                  Xoá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal tạo/sửa */}
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Sửa tác giả" : "Tạo mới tác giả"}</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Tên</label>
              <input {...register("name", { required: true })} className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input {...register("phone", { required: true })} className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input {...register("email", { required: true })} className="form-control" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Huỷ
            </Button>
            <Button variant="primary" type="submit">
              {editingId ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Modal xác nhận xoá */}
      <Modal show={showDeleteModal} centered onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xoá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xoá tác giả{" "}
          <strong>{deletingAuthor?.name}</strong> không?
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

export default Authors;
