import HeaderPage from '../components/HeaderPage';
import AuthorUpsertModal from '../components/AuthorUpsertModal';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
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
  AUTHOR_MODAL_TYPE,
  type AuthorModalType,
  type IAuthor,
} from '../types/authors.type';
import { useAuthorStore } from '../stores/author.store';
import type { AuthorParams } from '../apis/author.api';

const Authors = () => {
  const { getAuthorsByConditions, authors, deleteAuthorById } = useAuthorStore();

  const [authorData, setAuthorData] = useState<IAuthor[]>([]);
  const [authorIdSelection, setAuthorIdSelection] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<AuthorModalType>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteAuthor, setDeleteAuthor] = useState<IAuthor | null>(null);

  // Hàm load authors có params
  const loadAuthors = async (search = '') => {
    let paramsApi: AuthorParams = {
      page: 1,
      limit: 10,
    };

    if (search.trim() !== '') {
      if (/^\d+$/.test(search)) {
        // toàn số → search theo phone
        paramsApi.searchBy = 'phone';
        paramsApi.value = search;
      } else if (/\S+@\S+\.\S+/.test(search)) {
        // có dạng email
        paramsApi.searchBy = 'email';
        paramsApi.value = search;
      } else {
        // mặc định là tên
        paramsApi.searchBy = 'name';
        paramsApi.value = search;
      }
    }

    await getAuthorsByConditions(paramsApi);
  };


  const onClickAdd = () => {
    setShowModal(true);
    setModalType(AUTHOR_MODAL_TYPE.CREATE);
    setAuthorIdSelection([]);
  };

  const handleDelete = (author: IAuthor) => {
    setDeleteAuthor(author);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteAuthor) {
      await deleteAuthorById(deleteAuthor?._id ?? "");
      await loadAuthors(keyword);
      setDeleteAuthor(null);
      setShowDeleteDialog(false);
    }
  };

  // Lần đầu load
  useEffect(() => {
    loadAuthors();
  }, []);

  // Khi authors trong store thay đổi thì set lại state local
  useEffect(() => {
    if (authors && authors.length > 0) {
      setAuthorData(authors);
    }
  }, [authors]);

  // Khi keyword thay đổi thì gọi API mới (debounce để giảm call)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAuthors(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const columns: GridColDef<IAuthor>[] = [
    {
      field: 'name',
      headerName: 'Họ tên',
      flex: 1,
      align: 'left',
      editable: true,
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      flex: 1,
      align: 'left',
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
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
              setAuthorIdSelection([params.row._id ?? '']);
              setModalType(AUTHOR_MODAL_TYPE.UPDATE);
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
          <AuthorUpsertModal
            authorId={authorIdSelection}
            type={modalType ?? ''}
            onCloseModal={() => setShowModal(false)}
            loadAuthors={loadAuthors}
          />
        </div>
      )}

      {/* Dialog xác nhận xóa */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa tác giả này không?</p>
          {deleteAuthor && (
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Tên:</strong> {deleteAuthor.name}</p>
              <p><strong>Email:</strong> {deleteAuthor.email}</p>
              <p><strong>SĐT:</strong> {deleteAuthor.phone}</p>
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
        title="Quản lý tác giả"
        onKeywordChange={setKeyword}
        onAddClick={onClickAdd}
      />

      {authorData.length > 0 ? (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={authorData}
            columns={columns}
            getRowId={(row) => row._id ?? ''}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(ids) => {
              const rowIds = ids as unknown as string[];
              setAuthorIdSelection(rowIds.map((id) => id));
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

export default Authors;
