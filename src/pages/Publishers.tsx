import HeaderPage from '../components/HeaderPage';
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
  PUBLISHER_MODAL_TYPE,
  type IPublishers,
  type PublisherModalType,
} from '../types/publishers.type';
import { usePublisherStore } from '../stores/publisher.store';
import type { PublisherParams } from '../apis/publisher.api';
import PublisherUpsertModal from '../components/PublisherUpsertModal';

const Publishers = () => {
  const { getPublishersByConditions, publishers, deletePublisherById } = usePublisherStore();

  const [publisherData, setPublisherData] = useState<IPublishers[]>([]);
  const [publisherIdSelection, setPublisherIdSelection] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<PublisherModalType>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePublisher, setDeletePublisher] = useState<IPublishers | null>(null);

  // Hàm load publishers có params
  const loadPublishers = async (search = '') => {
    let paramsApi: PublisherParams = {
      page: 1,
      limit: 10,
    };

    if (search.trim() !== '') {
      paramsApi.searchBy = 'name';
      paramsApi.value = search;
    }

    await getPublishersByConditions(paramsApi);
  };

  const onClickAdd = () => {
    setShowModal(true);
    setModalType(PUBLISHER_MODAL_TYPE.CREATE);
    setPublisherIdSelection([]);
  };

  const handleDelete = (publisher: IPublishers) => {
    setDeletePublisher(publisher);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deletePublisher) {
      await deletePublisherById(deletePublisher?._id ?? "");
      await loadPublishers(keyword);
      setDeletePublisher(null);
      setShowDeleteDialog(false);
    }
  };

  // Lần đầu load
  useEffect(() => {
    loadPublishers();
  }, []);

  // Khi publishers trong store thay đổi thì set lại state local
  useEffect(() => {
    if (publishers && publishers.length > 0) {
      setPublisherData(publishers);
    }
  }, [publishers]);

  // Khi keyword thay đổi thì gọi API mới (debounce để giảm call)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPublishers(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const columns: GridColDef<IPublishers>[] = [
    {
      field: 'name',
      headerName: 'Tên NXB',
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
              setPublisherIdSelection([params.row._id ?? '']);
              setModalType(PUBLISHER_MODAL_TYPE.UPDATE);
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
          <PublisherUpsertModal
            publisherId={publisherIdSelection}
            type={modalType ?? ''}
            onCloseModal={() => setShowModal(false)}
            loadPublishers={loadPublishers}
          />
        </div>
      )}

      {/* Dialog xác nhận xóa */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa nhà xuất bản này không?</p>
          {deletePublisher && (
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Tên nhà xuất bản:</strong> {deletePublisher.name}</p>
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
        title="Quản lý nhà xuất bản"
        onKeywordChange={setKeyword}
        onAddClick={onClickAdd}
      />

      {publisherData.length > 0 ? (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={publisherData}
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
              setPublisherIdSelection(rowIds.map((id) => id));
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

export default Publishers;
