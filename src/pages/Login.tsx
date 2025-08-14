import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { toast } from 'react-toastify';

const Login = () => {
  const { login, message } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const userCredentials = {
    email: '',
    password: '',
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const hanleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof typeof userCredentials;
    userCredentials[key] = value;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userCredentials.email || !userCredentials.password) {
      toast.error('Email hoặc password không được để trống');
      return;
    }
    try {
      await login(userCredentials);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      toast.error(message);
    }
  };

  useEffect(() => {
    toast.success(message);
  }, [message]);

  return (
    <div className={`w-full h-screen flex justify-center items-center`}>
      <div
        onSubmit={(e) => {
          handleLogin(e);
        }}
        className="w-[480px] shadow-md p-3 shadow-gray-400 shrink-1 rounded-md"
        style={{ boxShadow: '0 0 15px rgba(156, 163, 175, 0.6)' }}
      >
        <h1 className="text-center font-semibold text-[32px]">Đăng nhập</h1>
        <div>
          <label htmlFor="email">Email</label>
          <div className="w-full flex items-center justify-center border">
            <input
              type="text"
              name="email"
              id=""
              onChange={(e) => hanleInputChange(e)}
              className="w-full p-2 focus:outline-none"
            />
            <button className="p-3 border border-l border-t-0 border-r-0 border-b-0">
              <MdEmail size={20} />
            </button>
          </div>
        </div>
        <div className="my-3">
          <label htmlFor="password">Password</label>
          <div className="w-full flex items-center justify-center border">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id=""
              onChange={(e) => hanleInputChange(e)}
              className="w-full p-2 focus:outline-none"
            />
            <button
              onClick={() => handleShowPassword()}
              className="p-3 border border-l border-t-0 border-r-0 border-b-0"
            >
              {showPassword ? (
                <BsEyeFill size={20} />
              ) : (
                <BsEyeSlashFill size={20} />
              )}
            </button>
          </div>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-[0.8em]"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Login;
