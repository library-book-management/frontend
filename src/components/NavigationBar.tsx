// import { MdSpaceDashboard } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa6';
import { PiBooksFill } from 'react-icons/pi';
import { FaRegListAlt } from 'react-icons/fa';
import { PiOfficeChairFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { toast } from 'react-toastify';

const navLinks = [
  // {
  //   name: 'Dashboard',
  //   path: '/',
  //   icon: <MdSpaceDashboard size={24} />,
  // },
  {
    name: 'Người dùng',
    path: '/',
    icon: <FaUserFriends size={24} />,
  },
  {
    name: 'Tác giả',
    path: '/authors',
    icon: <FaBook size={24} />,
  },
  {
    name: 'Sách',
    path: '/books',
    icon: <PiBooksFill size={24} />,
  },
  {
    name: 'Thể loại',
    path: '/categories',
    icon: <FaRegListAlt size={24} />,
  },
  {
    name: 'Nhà xuất bản',
    path: '/publishers',
    icon: <PiOfficeChairFill size={24} />,
  },
];

const NavigationBar = ({ className }: { className: string }) => {
  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công');
  };
  return (
    <div className={className}>
      <div className="text-2xl font-bold text-center my-12">Logo here</div>
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '4px',
          gap: '4px',
        }}
      >
        {navLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: 'black',
            }}
            className="p-2 hover:bg-gray-100 transition-all rounded-md"
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
      <button
        className="absolute bottom-0 bg-black text-white w-full py-2"
        onClick={handleLogout}
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default NavigationBar;
