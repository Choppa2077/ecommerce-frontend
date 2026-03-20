import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useLikeProductMutation } from '../query/useProductQueries';
import { useProductLikedQuery } from '../query/useProductQueries';
import type { Product } from '../api/product.api.types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const { data: likedData } = useProductLikedQuery(product.id);
  const likeMutation = useLikeProductMutation();

  const isLiked = likedData?.liked || false;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeMutation.mutate({ id: product.id, isLiked });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageError && product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Осталось: {product.stock}
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Нет в наличии
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'
            } transition-colors`}
          />
        </button>

        {/* Quick Actions (shown on hover) */}
      
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <span
            className={`text-sm ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
          </span>
        </div>
      </div>
    </Link>
  );
};