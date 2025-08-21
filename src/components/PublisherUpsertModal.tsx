import { useEffect, useState } from 'react';
import { usePublisherStore } from '../stores/publisher.store';
import { PUBLISHER_MODAL_TYPE, type IPublishers, type PublisherModalType } from '../types/publishers.type';
import { toast } from 'react-toastify';

const PublisherUpsertModal = ({
  publisherId,
  type,
  onCloseModal,
  loadPublishers,
}: {
  publisherId: string[];
  type: PublisherModalType | string;
  onCloseModal: () => void;
  loadPublishers: () => void;
}) => {
  const { getPublisherById, publisher, updatePublisherById, createPublisher } = usePublisherStore();
  const [publisherCredentials, setPublisherCredentials] = useState<IPublishers>({
    name: '',
  });

  // Lấy publisher theo id khi mở modal update
  useEffect(() => {
    if (type === PUBLISHER_MODAL_TYPE.UPDATE && publisherId.length > 0) {
      getPublisherById(publisherId[0]);
    }
  }, [publisherId, type]);

  // Khi publisher trong store thay đổi => sync state local
  useEffect(() => {
    if (publisher) {
      setPublisherCredentials(publisher);
    }
  }, [publisher]);

  // Khi mở modal tạo mới
  useEffect(() => {
    if (type === PUBLISHER_MODAL_TYPE.CREATE) {
      setPublisherCredentials({
        name: '',
      });
    }
  }, [type]);

  const handleUpdate = async () => {
    try {
      if (publisherCredentials) {
        const { _id, __v, createdAt, updatedAt, ...rest } = publisherCredentials as any;
        await updatePublisherById(publisherId[0], rest);
        loadPublishers();
        onCloseModal();
        toast.success('Cập nhật nhà xuất bản thành công');
      }
    } catch {
      toast.error('Lỗi khi cập nhật nhà xuất bản');
    }
  };

  const handleCreate = async () => {
    try {
      if (publisherCredentials) {
        await createPublisher(publisherCredentials);
        toast.success('Tạo nhà xuất bản thành công');
        loadPublishers();
        onCloseModal();
      }
    } catch {
      toast.error('Lỗi khi tạo nhà xuất bản');
    }
  };

  return (
    <div className="absolute z-10 w-[480px] bg-white p-3 rounded-md">
      <div className="border-b mb-2">
        <h1 className="text-xl font-semibold">Thông tin nhà xuất bản</h1>
      </div>

      <div>
        <label htmlFor="Name">Tên NXB</label>
        <input
          type="text"
          name="name"
          placeholder="Tên NXB"
          className="w-full border p-2 rounded-md mt-2"
          value={publisherCredentials?.name}
          onChange={(e) =>
            setPublisherCredentials({ ...publisherCredentials, name: e.target.value })
          }
        />
      </div>

      <div className="w-full flex justify-end mt-6">
        <button
          className="py-2 px-4 bg-green-500 hover:bg-green-600 rounded-md text-white"
          onClick={() => {
            if (type === PUBLISHER_MODAL_TYPE.UPDATE) {
              handleUpdate();
            } else {
              handleCreate();
            }
          }}
        >
          {PUBLISHER_MODAL_TYPE.CREATE === type ? 'Tạo' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
};

export default PublisherUpsertModal;
