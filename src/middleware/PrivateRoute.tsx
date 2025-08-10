import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

const RequireAuth = ({ children }: any) => {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
