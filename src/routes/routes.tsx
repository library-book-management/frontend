// import { MdSpaceDashboard } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa6';
import { PiBooksFill } from 'react-icons/pi';
import { FaRegListAlt } from 'react-icons/fa';
import { PiOfficeChairFill } from 'react-icons/pi';

// import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Publishers from '../pages/Publishers';
import Authors from '../pages/Authors';
import Books from '../pages/Books';
import Categories from '../pages/Categories';
import Login from '../pages/Login';

const routes = [
  // {
  //   component: <Dashboard />,
  //   path: '/',
  //   icons: <MdSpaceDashboard size={24} />,
  //   name: 'Dashboard',
  //   private: true,
  // },
  {
    component: <Users />,
    path: '/',
    icons: <FaUserFriends size={24} />,
    name: 'Users',
    private: true,
  },
  {
    component: <Publishers />,
    path: '/publishers',
    icons: <PiOfficeChairFill size={24} />,
    name: 'Publishers',
    private: true,
  },
  {
    component: <Authors />,
    path: '/authors',
    icons: <FaBook size={24} />,
    name: 'Authors',
    private: true,
  },
  {
    component: <Books />,
    path: '/books',
    icons: <PiBooksFill size={24} />,
    name: 'Books',
    private: true,
  },
  {
    component: <Categories />,
    path: '/categories',
    icons: <FaRegListAlt size={24} />,
    name: 'Categories',
    private: true,
  },
  {
    component: <Login />,
    path: '/login',
    name: 'Login',
    private: false,
  },
];

export default routes;
