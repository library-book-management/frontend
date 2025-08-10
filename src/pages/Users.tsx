import React, { useEffect, useState } from 'react';
import HeaderPage from '../components/HeaderPage';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import type { User } from '../types/user.type';
import { useUserStore } from '../stores/user.store';
import { IconButton, Stack } from '@mui/material';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import UserUpsertModal from '../components/UserUpsertModal';
import { USER_MODAL_TYPE } from '../constant/userType';

const Users = () => {
  const { getUserByConditions, users } = useUserStore();
  const [userData, setUserData] = useState<User[]>([]);
  const [userIdSelection, setUserIdSelection] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(USER_MODAL_TYPE.CREATE);

  // Hàm load user có params
  const loadUsers = async (search = '') => {
    await getUserByConditions({ page: 1, limit: 10, keyword: search });
  };

  const handleSearch = () => {
    loadUsers(keyword);
  };

  const onClickAdd = () => {
    setShowModal(true);
    setModalType(USER_MODAL_TYPE.CREATE);
    setUserIdSelection([]);
  };

  // Lần đầu load
  useEffect(() => {
    loadUsers();
  }, []);

  // Khi users trong store thay đổi thì set lại state local
  useEffect(() => {
    setUserData(users || []);
  }, [users]);

  // Khi keyword thay đổi thì gọi API mới (debounce để giảm call)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(keyword);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [keyword]);

  const columns: GridColDef<User>[] = [
    {
      field: 'name',
      headerName: 'Họ tên',
      flex: 1,
      align: 'left',
      editable: true,
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
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
      field: 'role',
      headerName: 'Phân quyền',
      sortable: false,
      flex: 1,
      align: 'left',
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
            // onClick={() => handleEdit(params.row)}
            onClick={() => {
              setShowModal(true);
              setUserIdSelection([params.row._id]);
              setModalType(USER_MODAL_TYPE.UPDATE);
            }}
          >
            <BiEdit fontSize="inherit" />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            // onClick={() => handleDelete(params.row._id)}
            className="flex items-center justify-center"
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
          <UserUpsertModal
            userId={userIdSelection}
            type={modalType}
            onCloseModal={() => setShowModal(false)}
            loadUsers={loadUsers}
          />
        </div>
      )}
      <HeaderPage
        title="Quản lý độc giả"
        onKeywordChange={setKeyword}
        onAddClick={onClickAdd}
      />
      {userData.length > 0 ? (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={userData}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(ids) => setUserIdSelection(ids)}
          />
        </Box>
      ) : (
        <div className="w-full h-[480px] flex items-center justify-center overflow-hidden">
          <img
            src="https://img.freepik.com/premium-vector/geen-data-gevonden_585024-42.jpg"
            className=""
          />
        </div>
      )}
    </div>
  );
};

export default Users;
