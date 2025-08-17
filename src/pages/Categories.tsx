import HeaderPage from '../components/HeaderPage';
import CategoryUpsertModal from '../components/CategoryUpsertModal';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useState } from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import {
  CATEGORY_MODAL_TYPE,
  type CategoryModalType,
  type ICategory,
} from '../types/categories.type';
import { useCategoryStore } from '../stores/category.store';
import type { CategoryParams } from '../apis/category.api';
import { toast } from 'react-toastify';

const Categories = () => {
  const { getCategoriesByConditions, categories, deleteCategoryById } = useCategoryStore();

  const [categoryData, setCategoryData] = useState<ICategory[]>([]);
  const [categoryIdSelection, setCategoryIdSelection] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<CategoryModalType>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<ICategory | null>(null);

  // Hàm load Categories có params
  const loadCategories = useCallback(async (search = '') => {
    let paramsApi: CategoryParams = {
      page: 1,
      limit: 10,
    };

    if (search.trim() !== '') {
        // mặc định là tên
        paramsApi.searchBy = 'name';
        paramsApi.value = search;
    }

    await getCategoriesByConditions(paramsApi);
  },  [getCategoriesByConditions] );


  function onClickAdd() {
    setShowModal(true);
    setModalType(CATEGORY_MODAL_TYPE.CREATE);
    setCategoryIdSelection([]);
  }

  const handleDelete = (Category: ICategory) => {
    setDeleteCategory(Category);
    setShowDeleteDialog(true);
  };

 const confirmDelete = async () => {
  if (deleteCategory) {
    try {
      await deleteCategoryById(deleteCategory._id ?? "");
      await loadCategories(keyword);
      toast.success('Xoá thể loại thành công');     // ✅ Thông báo
    } catch {
      toast.error('Không thể xoá thể loại');
    } finally {
      setDeleteCategory(null);
      setShowDeleteDialog(false);                   // đóng dialog
    }
  }
};


  // Lần đầu load
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Khi Categories trong store thay đổi thì set lại state local
  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoryData(categories);
    }
  }, [categories]);

  // Khi keyword thay đổi thì gọi API mới (debounce để giảm call)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, loadCategories]);

  const columns: GridColDef<ICategory>[] = [
    {
      field: 'name',
      headerName: 'Thể loại',
      flex: 1,
      align: 'left',
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      sortable: false,
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="left"
          alignItems="center"
          className="h-full"
        >
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setShowModal(true);
              setCategoryIdSelection([params.row._id ?? '']);
              setModalType(CATEGORY_MODAL_TYPE.UPDATE);
            }}
          >
            <BiEdit fontSize="inherit" />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            className="flex items-center justify-center"
            onClick={() => handleDelete(params.row)}
          >
            <MdDelete fontSize="inherit" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <div className="relative">
      {showModal && (
        <div className="absolute w-full h-[92vh] flex items-center justify-center">
          <div
            className="w-full h-screen fixed top-0 left-0 bg-black opacity-50 flex justify-center items-center z-10"
            onClick={() => setShowModal(false)}
          ></div>
          <CategoryUpsertModal
            CategoryId={categoryIdSelection}
            type={modalType ?? ''}
            onCloseModal={() => setShowModal(false)}
            loadCategories={loadCategories}
          />
        </div>
      )}

      {/* Dialog xác nhận xóa */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa thể loại này không?</p>
          {deleteCategory && (
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Tên:</strong> {deleteCategory.name}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Hủy</Button>
          <Button color="error" onClick={confirmDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>


      <HeaderPage
        title="Quản lý thể loại"
        onKeywordChange={setKeyword}
        onAddClick={onClickAdd}
      />

      {categoryData.length > 0 ? (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={categoryData}
            columns={columns}
            getRowId={(row) => row._id ?? ''}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(ids) => {
                if (Array.isArray(ids)) {
                  setCategoryIdSelection(ids as string[]);
                } else {
                  setCategoryIdSelection([]);
                }
              }}
          />
        </Box>
      ) : (
        <div className="w-full h-[480px] flex items-center justify-center overflow-hidden">
          <img
            src="https://img.freepik.com/premium-vector/geen-data-gevonden_585024-42.jpg"
            alt="Không có dữ liệu"
          />
        </div>
      )}
    </div>
  );
};

export default Categories;
