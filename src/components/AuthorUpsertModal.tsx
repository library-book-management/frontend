import { useEffect, useState } from 'react';
import { AUTHOR_MODAL_TYPE, type AuthorModalType, type IAuthor } from '../types/authors.type';
import { toast } from 'react-toastify';
import { useAuthorStore } from '../stores/author.store';

const AuthorUpsertModal = ({
  authorId,
  type,
  onCloseModal,
  loadAuthors,
}: {
  authorId: string[];
  type: AuthorModalType | string;
  onCloseModal: () => void;
  loadAuthors: () => void;
}) => {
  const { getAuthorById, author, updateAuthorById, createAuthor } = useAuthorStore();
  const [authorCredentials, setAuthorCredentials] = useState<IAuthor>({
    name: '',
    email: '',
    phone: '',
  });

  // Lấy author theo id khi mở modal update
  useEffect(() => {
    if (type === AUTHOR_MODAL_TYPE.UPDATE && authorId.length > 0) {
      getAuthorById(authorId[0]);
    }
  }, [authorId, type]);

  // Khi author trong store thay đổi => sync state local
  useEffect(() => {
    if (author) {
      setAuthorCredentials(author);
    }
  }, [author]);

  // Khi mở modal tạo mới
  useEffect(() => {
    if (type === AUTHOR_MODAL_TYPE.CREATE) {
      setAuthorCredentials({
        name: '',
        email: '',
        phone: '',
      });
    }
  }, [type]);

  const handleUpdate = async () => {
    try {
      if (authorCredentials) {
        const { _id, __v, createdAt, updatedAt, ...rest } = authorCredentials as any;
        await updateAuthorById(authorId[0], rest);
        loadAuthors();
        onCloseModal();
        toast.success('Cập nhật tác giả thành công');
      }
    } catch {
      toast.error('Lỗi khi cập nhật tác giả');
    }
  };

  const handleCreate = async () => {
    try {
      if (authorCredentials) {
        await createAuthor(authorCredentials);
        toast.success('Tạo tác giả thành công');
        loadAuthors();
        onCloseModal();
      }
    } catch {
      toast.error('Lỗi khi tạo tác giả');
    }
  };

  return (
    <div className="absolute z-10 w-[480px] bg-white p-3 rounded-md">
      <div className="border-b mb-2">
        <h1 className="text-xl font-semibold">Thông tin tác giả</h1>
      </div>

      <div>
        <label htmlFor="Name">Họ tên</label>
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          className="w-full border p-2 rounded-md"
          value={authorCredentials?.name}
          onChange={(e) =>
            setAuthorCredentials({ ...authorCredentials, name: e.target.value })
          }
        />
      </div>

      <div className="my-2">
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded-md"
          value={authorCredentials?.email}
          onChange={(e) =>
            setAuthorCredentials({ ...authorCredentials, email: e.target.value })
          }
        />
      </div>

      <div className="my-2">
        <label htmlFor="Phone">Số điện thoại</label>
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          className="w-full border p-2 rounded-md"
          value={authorCredentials?.phone}
          onChange={(e) =>
            setAuthorCredentials({ ...authorCredentials, phone: e.target.value })
          }
        />
      </div>

      <div className="w-full flex justify-end">
        <button
          className="py-2 px-4 bg-green-500 hover:bg-green-600 rounded-md text-white"
          onClick={() => {
            if (type === AUTHOR_MODAL_TYPE.UPDATE) {
              handleUpdate();
            } else {
              handleCreate();
            }
          }}
        >
          {AUTHOR_MODAL_TYPE.CREATE === type ? 'Tạo' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
};

export default AuthorUpsertModal;
