import { toast } from 'react-toastify';
import { useUserStore } from '../stores/user.store';

interface DeleteConfirmModalProps {
  userId: string;
  show: boolean;
  onClickModal: () => void;
  loadUsers: () => void;
}

export default function DeleteConfirmModal({
  userId,
  show,
  onClickModal,
  loadUsers,
}: DeleteConfirmModalProps) {
  const { deleteUserById } = useUserStore();

  const handleDelete = async () => {
    await deleteUserById(userId);
    setTimeout(async () => {
      await loadUsers();
      toast.success('Xóa người dùng thanh công');
      onClickModal();
    }, 1000);
  };

  if (!show) return null; // ẩn modal khi show=false

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800">
          Xác nhận xoá người dùng?
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Bạn có chắc chắn muốn xoá user? Hành động này không thể hoàn tác.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClickModal}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
