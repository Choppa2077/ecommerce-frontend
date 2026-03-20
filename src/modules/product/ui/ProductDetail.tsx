import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Eye,
  ArrowLeft,
  Plus,
  Minus,
  Loader2,
  Check,
  Package,
  TrendingUp,
} from 'lucide-react';
import {
  useProductQuery,
  useProductStatisticsQuery,
  useProductLikedQuery,
  useProductPurchasedQuery,
  useLikeProductMutation,
  usePurchaseProductMutation,
  useViewProductMutation,
} from '../query/useProductQueries';
import { useCategoryQuery } from '../../category/query/useCategoriesQuery';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = parseInt(id!);

  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);

  const { data: product, isLoading: productLoading } = useProductQuery(productId);
  const { data: statistics } = useProductStatisticsQuery(productId);
  const { data: category } = useCategoryQuery(product?.category_id || 0);
  const { data: likedData } = useProductLikedQuery(productId);
  const { data: purchasedData } = useProductPurchasedQuery(productId);

  const likeMutation = useLikeProductMutation();
  const purchaseMutation = usePurchaseProductMutation();
  const viewMutation = useViewProductMutation();

  const isLiked = likedData.liked || false;
  const isPurchased = purchasedData?.purchased || false;

  // Track view when component mounts
  useEffect(() => {
    if (productId) {
      viewMutation.mutate(productId);
    }
  }, [productId]);

  const handleLike = () => {
    likeMutation.mutate({ id: productId, isLiked });
  };

  const handlePurchase = async () => {
    try {
      await purchaseMutation.mutateAsync({
        id: productId,
        data: { quantity },
      });
      setShowPurchaseSuccess(true);
      setTimeout(() => setShowPurchaseSuccess(false), 3000);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Товар не найден</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Вернуться к каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {!imageError && product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <ShoppingCart className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Statistics */}
              {statistics && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Eye className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-2xl font-semibold">{statistics.view_count}</div>
                    <div className="text-xs text-gray-500">Просмотров</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Heart className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-2xl font-semibold">{statistics.like_count}</div>
                    <div className="text-xs text-gray-500">Лайков</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <div className="text-2xl font-semibold">{statistics.purchase_count}</div>
                    <div className="text-xs text-gray-500">Покупок</div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div>
              {/* Category */}
              {category && (
                <div className="text-sm text-blue-600 font-medium mb-2">
                  {category.name}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
                {quantity > 1 && (
                  <div className="text-sm text-gray-500 mt-1">
                    Итого: {formatPrice(product.price * quantity)}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Наличие:</span>
                  {product.stock > 0 ? (
                    <span className="text-sm text-green-600">
                      В наличии ({product.stock} шт.)
                    </span>
                  ) : (
                    <span className="text-sm text-red-600">Нет в наличии</span>
                  )}
                </div>
                {product.stock > 0 && product.stock <= 5 && (
                  <div className="text-sm text-orange-600">
                    Осталось всего {product.stock} шт. Спешите!
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Количество:
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val >= 1 && val <= product.stock) {
                            setQuantity(val);
                          }
                        }}
                        className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                        min="1"
                        max={product.stock}
                      />
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stock}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handlePurchase}
                  disabled={product.stock === 0 || purchaseMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {purchaseMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Оформление...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Купить
                    </>
                  )}
                </button>
                <button
                  onClick={handleLike}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isLiked
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`}
                  />
                </button>
              </div>

              {/* Success Message */}
              {showPurchaseSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-700">
                    Покупка успешно оформлена!
                  </span>
                </div>
              )}

              {/* Already Purchased Badge */}
              {isPurchased && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700">
                    Вы уже приобрели этот товар
                  </span>
                </div>
              )}

              {/* Popularity Badge */}
              {statistics && statistics.purchase_count > 10 && (
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-700">
                    Популярный товар! Куплено {statistics.purchase_count} раз
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};