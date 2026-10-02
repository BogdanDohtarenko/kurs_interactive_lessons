import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return ;
  }

  return ;
};

export default ProtectedRoute;