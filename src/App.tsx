import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from './modules/auth/ui/LoginForm';
import { RegisterForm } from './modules/auth/ui/RegisterForm';
import { ProfileEditForm } from './modules/profile/ui/ProfileEditForm';
import { HomePage } from './pages/HomePage';
import { ProtectedRoute } from './shared/components/ProtectedRoute/ProtectedRoute';
import { ROUTES } from './shared/config/routes';
import { useAuthStateSelector } from './modules/auth/store/useAuthStore';
import { Layout } from './Layout';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PurchaseHistoryPage } from './pages/PurchaseHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const { accessToken } = useAuthStateSelector();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path={ROUTES.LOGIN}
            element={
              accessToken ? (
                <Navigate to={ROUTES.HOME} replace />
              ) : (
                <LoginForm />
              )
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              accessToken ? (
                <Navigate to={ROUTES.HOME} replace />
              ) : (
                <RegisterForm />
              )
            }
          />

          {/* Protected routes with Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {' '}
              {/* Layout оборачивает все защищенные страницы */}
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.PROFILE_EDIT} element={<ProfileEditForm />} />
              {/* TODO: Add more protected routes */}
              <Route path="/products" element={<div>Страница товаров</div>} />
              <Route
                path="/products/:id"
                element={<ProductDetailPage />}
              />{' '}
              {/* Добавьте этот маршрут */}
              <Route path="/purchases" element={<PurchaseHistoryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/profile" element={<ProfilePage/>} />
            </Route>
          </Route>

          {/* Redirect root to home if authenticated, login otherwise */}
          <Route
            path="/"
            element={
              <Navigate to={accessToken ? ROUTES.HOME : ROUTES.LOGIN} replace />
            }
          />

          {/* Catch all - redirect to home or login */}
          <Route
            path="*"
            element={
              <Navigate to={accessToken ? ROUTES.HOME : ROUTES.LOGIN} replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
