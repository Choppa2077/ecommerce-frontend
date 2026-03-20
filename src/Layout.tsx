import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Heart,
  Package,
  LogOut,
  Home,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from './modules/auth/store/useAuthStore';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearTokens } = useAuthStore();

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Main Nav */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-xl font-bold">E</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  E-Commerce
                </span>
              </Link>

              <div className="hidden md:flex ml-10 space-x-8">
                <Link
                  to="/purchases"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/purchases')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Package className="w-4 h-4 mr-1" />
                  Покупки
                </Link>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className={`p-2 rounded-lg transition-colors ${
                  isActive('/profile')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around py-2">
            <Link
              to="/purchases"
              className={`p-2 rounded-lg ${
                isActive('/purchases') ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Package className="w-5 h-5" />
            </Link>
            <Link
              to="/profile"
              className={`p-2 rounded-lg ${
                isActive('/profile') ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};
