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
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Books = () => {
  const { getBooks, deleteBookById, books, getBookById } = useBookStore();
  const [bookData, setBookData] = useState<IBook[]>([]);
  const [bookIdSelection, setBookIdSelection] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<BookModalType>();
  const [loading, setLoading] = useState(false);
  const [selectedBookData, setSelectedBookData] = useState<IBook | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<IBook | null>(null);

  const loadBooks = async (search = '') => {
    try {
      setLoading(true);

      await getBooks({ page: 1, limit: 10, search: search });
    } catch (error) {
      console.error('❌ Lỗi khi gọi API:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    console.log('🗑️ Đang xóa book:', bookId);

    // Xóa sách từ API
    await deleteBookById(bookId);

    // Cập nhật local state ngay lập tức để UI responsive
    setBookData((prevBooks) => prevBooks.filter((book) => book._id !== bookId));

    // Sau đó reload data từ server để đảm bảo sync
    try {
      await loadBooks(keyword);
    } catch (error) {
      console.error(
        '⚠️ Error reloading data, but delete was successful:',
        error
      );
      // Nếu reload fail, ít nhất UI đã được update
    }
  };

  const onClickDelete = (book: IBook) => {
    console.log('🗑️ Preparing to delete book:', book);
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const onClickAdd = () => {
    setShowModal(true);
    setModalType(BOOK_MODAL_TYPE.CREATE);
    setBookIdSelection([]);
    setSelectedBookData(null);
  };

  const onClickEdit = async (bookId: string) => {
    try {
      // Tìm book data từ danh sách hiện tại
      const bookToEdit = bookData.find((book) => book._id === bookId);

      if (bookToEdit) {
        console.log('📖 Found book data:', bookToEdit);
        setSelectedBookData(bookToEdit);
        setBookIdSelection([bookId]);
        setModalType(BOOK_MODAL_TYPE.UPDATE);
        setShowModal(true);
      } else {
        const fetchedBook = await getBookById(bookId);
        setSelectedBookData(fetchedBook as any);
        setBookIdSelection([bookId]);
        setModalType(BOOK_MODAL_TYPE.UPDATE);
        setShowModal(true);
      }
    } catch (error) {
      console.error('❌ Error loading book for edit:', error);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (books && Array.isArray(books)) {
      setBookData(books);
    } else {
      setBookData([]);
    }
  }, [books]);

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
      field: 'author_id',
      headerName: 'Tác giả',
      flex: 1.5,
      align: 'left',
      editable: true,
      renderCell: (params) => {
        const authors = params.value as IBook['author_id'];
        if (!authors || !Array.isArray(authors) || authors.length === 0) {
          return <div className="py-2">Chưa có tác giả</div>;
        }

        // Hiển thị tên tác giả đầu tiên, nếu có nhiều hơn thì thêm "..."
        const displayText =
          authors.length > 1
            ? `${authors[0].name} (+${authors.length - 1})`
            : authors[0].name;

        return <div className="py-2">{displayText}</div>;
      },
    },
    {
      field: 'publisher_id',
      headerName: 'Nhà xuất bản',
      flex: 1.5,
      align: 'left',
      renderCell: (params) => {
        const publishers = params.value as IBook['publisher_id'];
        if (
          !publishers ||
          !Array.isArray(publishers) ||
          publishers.length === 0
        ) {
          return <div className="py-2">Chưa có NXB</div>;
        }

        // Hiển thị tên NXB đầu tiên, nếu có nhiều hơn thì thêm "..."
        const displayText =
          publishers.length > 1
            ? `${publishers[0].name} (+${publishers.length - 1})`
            : publishers[0].name;

        return <div className="py-2">{displayText}</div>;
      },
    },
    {
      field: 'category_id',
      headerName: 'Thể loại',
      flex: 1.2,
      align: 'left',
      renderCell: (params) => {
        const categories = params.value as IBook['category_id'];
        if (
          !categories ||
          !Array.isArray(categories) ||
          categories.length === 0
        ) {
          return (
            <div className="py-2">
              <Chip
                label="Chưa phân loại"
                size="small"
                variant="outlined"
                color="default"
              />
            </div>
          );
        }

        // Hiển thị category đầu tiên
        const displayText =
          categories.length > 1
            ? `${categories[0].name} (+${categories.length - 1})`
            : categories[0].name;

        return (
          <div className="py-2">
            <Chip
              label={displayText}
              size="small"
              variant="outlined"
              color="primary"
            />
          </div>
        );
      },
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
            onClick={() => onClickEdit(params.row._id ?? '')}
          >
            <BiEdit fontSize="inherit" />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            className="flex items-center justify-center"
            onClick={() => onClickDelete(params.row)}
          >
            <MdDelete fontSize="inherit" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <div className="relative">
      {/* Book Upsert Modal */}
      {showModal && (
        <div className="absolute w-full h-[92vh] flex items-center justify-center">
          <div
            className="w-full h-screen fixed top-0 left-0 bg-black opacity-50 flex justify-center items-center z-10"
            onClick={() => setShowModal(false)}
          ></div>
          <BookUpsertModal
            bookId={bookIdSelection}
            type={modalType?.toUpperCase() as 'CREATE' | 'UPDATE'}
            onCloseModal={() => {
              setShowModal(false);
              setSelectedBookData(null);
            }}
            loadBooks={loadBooks}
            show={true}
            initialData={selectedBookData || undefined}
          />
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBookToDelete(null);
          // Optional: reload data khi đóng modal để đảm bảo data fresh
          // forceReloadBooks();
        }}
        onConfirm={async () => {
          if (bookToDelete) {
            try {
              await handleDelete(bookToDelete._id);
              // Reset states sau khi delete thành công
              setShowDeleteModal(false);
              setBookToDelete(null);
            } catch (error) {
              console.error('❌ Error deleting book:', error);
              // Có thể hiển thị toast error ở đây
              throw error; // Re-throw để modal biết có lỗi
            }
          }
        }}
        bookData={bookToDelete}
        title="Xác nhận xóa sách"
      />
      <HeaderPage
        title="Quản lý sách"
        onKeywordChange={setKeyword}
        onAddClick={onClickAdd}
      />
      {loading ? (
        <div className="w-full h-[480px] flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : bookData && bookData.length > 0 ? (
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
          <div className="text-center">
            <img
              src="https://img.freepik.com/premium-vector/geen-data-gevonden_585024-42.jpg"
              alt="No data found"
              className="mx-auto mb-4 w-48 h-48 object-contain"
            />
            <p className="text-gray-500 text-lg">Không có dữ liệu</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
