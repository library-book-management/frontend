import { useEffect, useState } from 'react';
import HeaderPage from '../components/HeaderPage';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip } from '@mui/material';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import {
  BOOK_MODAL_TYPE,
  type BookModalType,
  type IBook,
} from '../types/book.type';
import { useBookStore } from '../stores/book.store';
import BookUpsertModal from '../components/BookUpsertModal';

const Books = () => {
  const { getBooks, deleteBookById, books } = useBookStore();
  const [bookData, setBookData] = useState<IBook[]>([]);
  const [bookIdSelection, setBookIdSelection] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<BookModalType>();

  // Hàm load book có params
  const loadBooks = async (search = '') => {
    await getBooks({ page: 1, limit: 10, keyword: search });
  };

  const handleDelete = async (bookId: string) => {
    await deleteBookById(bookId);
    await loadBooks(keyword); // cập nhật lại danh sách book
  };

  const onClickAdd = () => {
    setShowModal(true);
    setModalType(BOOK_MODAL_TYPE.CREATE);
    setBookIdSelection([]);
  };

  // Lần đầu load
  useEffect(() => {
    loadBooks();
  }, []);

  // Khi books trong store thay đổi thì set lại state local
  useEffect(() => {
    if (books) {
      setBookData(books);
    }
  }, [books]);

  // Khi keyword thay đổi thì gọi API mới (debounce để giảm call)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooks(keyword);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [keyword]);

  const columns: GridColDef<IBook>[] = [
    {
      field: 'title',
      headerName: 'Tiêu đề',
      flex: 2,
      align: 'left',
      editable: true,
    },
    {
      field: 'author',
      headerName: 'Tác giả',
      flex: 1.5,
      align: 'left',
      editable: true,
      renderCell: (params) => (
        <div className="py-2">{params.value?.name || 'Chưa có tác giả'}</div>
      ),
    },
    {
      field: 'publisher',
      headerName: 'Nhà xuất bản',
      flex: 1.5,
      align: 'left',
      renderCell: (params) => (
        <div className="py-2">{params.value?.name || 'Chưa có NXB'}</div>
      ),
    },
    {
      field: 'category',
      headerName: 'Thể loại',
      flex: 1.2,
      align: 'left',
      renderCell: (params) => (
        <div className="py-2">
          <Chip
            label={params.value?.name || 'Chưa phân loại'}
            size="small"
            variant="outlined"
            color="primary"
          />
        </div>
      ),
    },
    {
      field: 'year_published',
      headerName: 'Năm XB',
      flex: 0.8,
      align: 'center',
      editable: true,
    },
    {
      field: 'isbn',
      headerName: 'ISBN',
      flex: 1.2,
      align: 'left',
      editable: true,
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      flex: 0.8,
      align: 'center',
      editable: true,
      renderCell: (params) => (
        <div className="py-2">
          <Chip
            label={params.value || 0}
            size="small"
            color={params.value > 0 ? 'success' : 'error'}
            variant="filled"
          />
        </div>
      ),
    },
    {
      field: 'price',
      headerName: 'Giá',
      flex: 1,
      align: 'right',
      editable: true,
      renderCell: (params) => (
        <div className="py-2 font-medium text-green-600">
          {params.value ? `${params.value.toLocaleString('vi-VN')} ₫` : '0 ₫'}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      sortable: false,
      flex: 1,
      align: 'center',
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
          className="h-full"
        >
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setShowModal(true);
              setBookIdSelection([params.row._id ?? '']);
              setModalType(BOOK_MODAL_TYPE.UPDATE);
            }}
          >
            <BiEdit fontSize="inherit" />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            className="flex items-center justify-center"
            onClick={() => handleDelete(params.row._id ?? '')}
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
          <BookUpsertModal
            bookId={bookIdSelection}
            type={modalType?.toUpperCase() as 'CREATE' | 'UPDATE'}
            onCloseModal={() => setShowModal(false)}
            loadBooks={loadBooks}
            show={true} // sửa lại từ false thành true
          />
        </div>
      )}
      <HeaderPage
        title="Quản lý sách"
        onKeywordChange={setKeyword}
        onAddClick={onClickAdd}
      />
      {bookData && bookData.length > 0 ? (
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={bookData}
            columns={columns}
            getRowId={(row) => row._id ?? ''}
            initialState={{
              pagination: { paginationModel: { pageSize: 8 } },
            }}
            pageSizeOptions={[5, 8, 10]}
            checkboxSelection
            disableRowSelectionOnClick
            rowHeight={60}
            onRowSelectionModelChange={(ids) => {
              const rowIds = ids as unknown as string[];
              setBookIdSelection(rowIds.map((id) => id));
            }}
          />
        </Box>
      ) : (
        <div className="w-full h-[480px] flex items-center justify-center overflow-hidden">
          <img
            src="https://img.freepik.com/premium-vector/geen-data-gevonden_585024-42.jpg"
            alt="No data found"
            className=""
          />
        </div>
      )}
    </div>
  );
};

export default Books;
