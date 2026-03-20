import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStateSelector } from '../../../modules/auth/store/useAuthStore';
import { ROUTES } from '../../config/routes';

export const ProtectedRoute = () => {
  const { accessToken } = useAuthStateSelector();

  if (!accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};