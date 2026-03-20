import { Heart, Loader2 } from 'lucide-react';
import type { Like } from '../api/likes.api.types';
import { useLikesQuery } from '../../profile/query/useProfileQueries';
import { ProductCard } from '../../product/ui/ProductCard';

// Временный интерфейс для преобразования Like в Product
interface ProductFromLike extends Omit<Like, 'interacted_at'> {
  id: number;
  description: string;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
}

export const LikesList = () => {
  const { data: likesData, isLoading, error } = useLikesQuery();

  // Преобразуем Like в Product для использования в ProductCard
  const likedProducts: ProductFromLike[] = likesData?.likes.map(like => ({
    id: like.product_id,
    name: like.product_name,
    product_id: like.product_id,
    product_name: like.product_name,
    description: '', // Можно добавить описание если нужно
    category_id: like.category_id,
    price: like.price,
    stock: 1, // По умолчанию в наличии
    image_url: '', // Можно добавить изображение если есть
    is_active: true,
    created_at: '',
    updated_at: '',
    category_name: '' // Можно добавить название категории если нужно
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Ошибка загрузки
          </h3>
          <p className="text-red-600">
            Не удалось загрузить список избранных товаров
          </p>
        </div>
      </div>
    );
  }

  if (!likesData || likesData.count === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            В избранном пока пусто
          </h3>
          <p className="text-gray-500 mb-6">
            Добавляйте товары в избранное, чтобы не потерять их
          </p>
          <a
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Перейти к товарам
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Избранные товары
          </h1>
          <p className="text-gray-600">
            {likesData.count} {likesData.count === 1 ? 'товар' : 'товаров'} в избранном
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {likedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product as any}
            />
          ))}
        </div>
      </div>
    </div>
  );
};