import { MdSpaceDashboard } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa6';
import { PiBooksFill } from 'react-icons/pi';
import { FaRegListAlt } from 'react-icons/fa';
import { PiOfficeChairFill } from 'react-icons/pi';

import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Publishers from '../pages/Publishers';
import Authors from '../pages/Authors';
import Books from '../pages/Books';
import Categories from '../pages/Categories';

const routes = [
  {
    component: <Dashboard />,
    path: '/',
    icons: <MdSpaceDashboard size={24} />,
    name: 'Dashboard',
  },
  {
    component: <Users />,
    path: '/users',
    icons: <FaUserFriends size={24} />,
    name: 'Users',
  },
  {
    component: <Publishers />,
    path: '/publishers',
    icons: <PiOfficeChairFill size={24} />,
    name: 'Publishers',
  },
  {
    component: <Authors />,
    path: '/authors',
    icons: <FaBook size={24} />,
    name: 'Authors',
  },
  {
    component: <Books />,
    path: '/books',
    icons: <PiBooksFill size={24} />,
    name: 'Books',
  },
  {
    component: <Categories />,
    path: '/categories',
    icons: <FaRegListAlt size={24} />,
    name: 'Categories',
  },
];

export default routes;
