import React, { useEffect, useState } from 'react';
import { USER_MODAL_TYPE } from '../constant/userType';
import { useUserStore } from '../stores/user.store';
import type { User } from '../types/user.type';
import { toast } from 'react-toastify';

const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
};

const UserUpsertModal = ({
  userId,
  type,
  onCloseModal,
  loadUsers,
}: {
  userId: string;
  type: string;
  onCloseModal: () => void;
  loadUsers: () => void;
}) => {
  const { getUserById, user, updateUserById, createUser } = useUserStore();
  const [userCredentials, setUserCredentials] = useState<User | null>(null);

  useEffect(() => {
    getUserById(userId);
  }, [userId]);

  useEffect(() => {
    if (user) {
      setUserCredentials(user);
    }
  }, [user]);

  useEffect(() => {
    if (type === USER_MODAL_TYPE.CREATE) {
      setUserCredentials({
        name: '',
        email: '',
        role: USER_ROLE.USER,
        address: '',
      });
    }
  }, []);

  const handleUpdate = async () => {
    try {
      await updateUserById(userId, userCredentials);
      loadUsers();
      onCloseModal();
      toast.success('Cập nhật thẻ thành công');
    } catch (error) {
      toast.error('Lỗi khi cập nhật thẻ');
    }
  };

  const handleCreate = async () => {
    if (userCredentials) {
      try {
        await createUser(userCredentials);
        toast.success('Tạo thẻ thành công');
        loadUsers();
        onCloseModal();
      } catch (error) {
        toast.error('Lỗi khi tạo thẻ');
      }
    }
  };

  return (
    <div className="absolute z-10 w-[480px] bg-white p-3 rounded-md">
      <div className="border-b mb-2">
        <h1 className="text-xl font-semibold">Thông tin độc giả</h1>
      </div>
      <div>
        <label htmlFor="Name">Họ tên</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-2 rounded-md"
          value={userCredentials?.name}
          onChange={(e) =>
            setUserCredentials({ ...userCredentials, name: e.target.value })
          }
          disabled={type === USER_MODAL_TYPE.UPDATE ? true : false}
        />
      </div>
      <div className="my-2">
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded-md"
          value={userCredentials?.email}
          onChange={(e) =>
            setUserCredentials({ ...userCredentials, email: e.target.value })
          }
          disabled={type === USER_MODAL_TYPE.UPDATE ? true : false}
        />
      </div>
      <div className="my-2">
        <label htmlFor="Address">Địa chỉ</label>
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          className="w-full border p-2 rounded-md"
          value={userCredentials?.address}
          onChange={(e) =>
            setUserCredentials({ ...userCredentials, address: e.target.value })
          }
        />
      </div>

      <div className="w-full flex justify-end">
        <button
          className="py-2 px-4 bg-green-500 hover:bg-green-600 rounded-md text-white"
          onClick={() => {
            if (type === USER_MODAL_TYPE.UPDATE) {
              handleUpdate();
            } else {
              handleCreate();
            }
          }}
        >
          {USER_MODAL_TYPE.CREATE === type ? 'Tạo' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
};

export default UserUpsertModal;
