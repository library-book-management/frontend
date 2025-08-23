import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import type { IBook } from '../types/book.type';

interface DeleteConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
  bookData?: IBook | null;
  title?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  show,
  onClose,
  bookData,
  title = 'Xác nhận xóa sách',
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset success state when modal is opened/closed
  useEffect(() => {
    if (show) {
      setIsDeleting(false);
    }
  }, [show]);

  const handleConfirm = async () => {
    onClose();
    window.location.reload();
  };

  return (
    <Modal show={show} centered size="lg" onHide={onClose}>
      <Modal.Header closeButton={!isDeleting} className="border-0 pb-0">
        <Modal.Title className="text-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mb-3" onClick={() => !isDeleting && onClose()}>
            <i
              className="bi bi-trash3-fill text-danger"
              style={{ fontSize: '3rem' }}
            ></i>
          </div>

          {/* Confirmation Message */}
          <p className="mb-3">Bạn có chắc chắn muốn xóa sách này không?</p>

          {/* Book Details */}
          {bookData && (
            <div className="alert alert-light border rounded p-3 mb-3">
              <div className="text-start">
                <div className="mb-2">
                  <strong className="text-primary">Tên sách:</strong>
                  <div className="text-dark">{bookData.title}</div>
                </div>

                {bookData.author_id &&
                  Array.isArray(bookData.author_id) &&
                  bookData.author_id.length > 0 && (
                    <div className="mb-2">
                      <strong className="text-primary">Tác giả:</strong>
                      <div className="text-dark">
                        {bookData.author_id
                          .map((author) =>
                            typeof author === 'object' && author.name
                              ? author.name
                              : String(author)
                          )
                          .join(', ')}
                      </div>
                    </div>
                  )}

                {bookData.isbn && (
                  <div className="mb-2">
                    <strong className="text-primary">ISBN:</strong>
                    <div className="text-dark">{bookData.isbn}</div>
                  </div>
                )}

                {bookData.quantity !== undefined && (
                  <div className="mb-2">
                    <strong className="text-primary">Số lượng:</strong>
                    <div className="text-dark">
                      <span
                        className={`badge ${bookData.quantity > 0 ? 'bg-success' : 'bg-danger'}`}
                      >
                        {bookData.quantity} cuốn
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="alert alert-warning border-warning bg-warning-subtle d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
            <small className="mb-0">
              <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác!
            </small>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pt-0">
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={isDeleting}
          className="px-4"
        >
          <i className="bi bi-x-circle me-1"></i>
          Hủy bỏ
        </Button>

        <Button
          variant="danger"
          onClick={handleConfirm}
          disabled={isDeleting}
          className="px-4"
        >
          {isDeleting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Đang xóa...
            </>
          ) : (
            <>
              <i className="bi bi-trash3-fill me-1"></i>
              Xóa sách
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
