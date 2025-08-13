import type { ObjectType } from '../constant/userType';
import { FcCancel } from 'react-icons/fc';

type DeleteNoticeProps = {
  object: ObjectType;
  userId: string;
};

const DeleteNotice = (deleteNotice: DeleteNoticeProps) => {
  return (
    <div>
      <div className="border-b">
        <button className="w-[48px] h-[48px] bg-red-500 text-white">
          <FcCancel size={24} />
        </button>
      </div>
      <p>
        Bạn có muốn xóa {deleteNotice.object} có tên là {deleteNotice.userId}?
      </p>
      <div>
        <button>Hủy</button>
        <button>Xóa</button>
      </div>
    </div>
  );
};

export default DeleteNotice;
