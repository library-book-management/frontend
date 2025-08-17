import { useEffect, useState } from 'react';
import { useCategoryStore } from '../stores/category.store';
import { CATEGORY_MODAL_TYPE, type CategoryModalType, type ICategory } from '../types/categories.type';
import { toast } from 'react-toastify';

const CategoryUpsertModal = ({
  CategoryId,
  type,
  onCloseModal,
  loadCategories,
}: {
  CategoryId: string[];
  type: CategoryModalType | string;
  onCloseModal: () => void;
  loadCategories: () => void;
}) => {
  const { getCategoryById, category, updateCategoryById, createCategory } = useCategoryStore();
  const [CategoryCredentials, setCategoryCredentials] = useState<ICategory>({
    name: '',
  });

  // Lấy Category theo id khi mở modal update
  useEffect(() => {
    if (type === CATEGORY_MODAL_TYPE.UPDATE && CategoryId.length > 0) {
      getCategoryById(CategoryId[0]);
    }
  }, [CategoryId, getCategoryById, type]);

  // Khi Category trong store thay đổi => sync state local
  useEffect(() => {
    if (category) {
      setCategoryCredentials(category);
    }
  }, [category]);

  // Khi mở modal tạo mới
  useEffect(() => {
    if (type === CATEGORY_MODAL_TYPE.CREATE) {
      setCategoryCredentials({
        name: '',
      });
    }
  }, [type]);

  const handleUpdate = async () => {
    try {
      if (CategoryCredentials) {
        const { _id, __v, createdAt, updatedAt, ...rest } = CategoryCredentials as any;
        await updateCategoryById(CategoryId[0], rest);
        loadCategories();
        onCloseModal();
        toast.success('Cập nhật thể loại thành công');
      }
    } catch (error: any) {
   console.log('error', error)
    
    toast.error(error);
  }
  };

  const handleCreate = async () => {
    try {
      if (CategoryCredentials) {
        await createCategory(CategoryCredentials);
        toast.success('Tạo thể loại thành công');
        loadCategories();
        onCloseModal();
      }
    } catch (error: any) {
      console.log('error', error)
    
    toast.error(error);
  }
  };

  return (
    <div className="absolute z-10 w-[480px] bg-white p-3 rounded-md">
      <div className="border-b mb-2">
        <h1 className="text-xl font-semibold">Thông tin thể loại</h1>
      </div>
      <div className="my-2">
      <div>
        <label htmlFor="Name">Thể loại</label>
        <input
          type="text"
          name="name"
          placeholder="thể loại"
          className="w-full border p-2 rounded-md"
          value={CategoryCredentials?.name}
          onChange={(e) =>
            setCategoryCredentials({ ...CategoryCredentials, name: e.target.value })
          }
        />
      </div>
      </div>

      <div className="w-full flex justify-end">
        <button
          className="py-2 px-4 bg-green-500 hover:bg-green-600 rounded-md text-white"
          onClick={() => {
            if (type === CATEGORY_MODAL_TYPE.UPDATE) {
              handleUpdate();
            } else {
              handleCreate();
            }
          }}
        >
          {CATEGORY_MODAL_TYPE.CREATE === type ? 'Tạo' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
};

export default CategoryUpsertModal;
