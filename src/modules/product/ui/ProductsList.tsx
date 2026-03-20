import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useProductsQuery } from '../query/useProductQueries';
import { useCategoriesQuery } from '../../category/query/useCategoriesQuery';
import type { ProductListParams } from '../api/product.api.types';
import { useRecommendationsQuery } from '../../profile/query/useProfileQueries';

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductListParams>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined,
    min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
    max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_order: searchParams.get('sort_order') || 'desc',
  });

  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  // Используем debounce для поиска
  const debouncedSearch = useDebounce(localSearch, 500);

  const { data: productsData, isLoading } = useProductsQuery(filters);
  const { data: categoriesData } = useCategoriesQuery();
  const { data: recommendationsData } = useRecommendationsQuery();

  // Эффект для автоматического поиска при изменении debouncedSearch
  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      search: debouncedSearch,
      page: 1 // Сбрасываем на первую страницу при новом поиске
    }));
  }, [debouncedSearch]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    if (filters.search) params.set('search', filters.search);
    if (filters.category_id) params.set('category_id', filters.category_id.toString());
    if (filters.min_price) params.set('min_price', filters.min_price.toString());
    if (filters.max_price) params.set('max_price', filters.max_price.toString());
    if (filters.sort_by && filters.sort_by !== 'created_at') params.set('sort_by', filters.sort_by);
    if (filters.sort_order && filters.sort_order !== 'desc') params.set('sort_order', filters.sort_order);
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterChange = (key: keyof ProductListParams, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    // Правильно разбиваем значение селекта на sort_by и sort_order
    const [sort_by, sort_order] = value.split('-');
    setFilters({ 
      ...filters, 
      sort_by, 
      sort_order,
      page: 1 
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      sort_by: 'created_at',
      sort_order: 'desc',
    });
    setLocalSearch('');
  };

  const hasSearch = !!filters.search;
  const hasFilters = filters.category_id !== undefined ||
    filters.min_price !== undefined ||
    filters.max_price !== undefined ||
    filters.sort_by !== 'created_at' ||
    filters.sort_order !== 'desc';

  const showRecommendations = !hasSearch && !hasFilters && recommendationsData?.recommendations?.length > 0;

  // Получаем текущее значение для селекта сортировки
  const getCurrentSortValue = () => {
    return `${filters.sort_by}-${filters.sort_order}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Каталог товаров
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Поиск товаров..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Найти
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Категория
                  </label>
                  <select
                    value={filters.category_id || ''}
                    onChange={(e) => handleFilterChange('category_id', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Все категории</option>
                    {categoriesData?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цена от
                  </label>
                  <input
                    type="number"
                    value={filters.min_price || ''}
                    onChange={(e) => handleFilterChange('min_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цена до
                  </label>
                  <input
                    type="number"
                    value={filters.max_price || ''}
                    onChange={(e) => handleFilterChange('max_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="10000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Сортировка
                  </label>
                  <select
                    value={getCurrentSortValue()}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="created_at-desc">Новинки</option>
                    <option value="price-asc">Цена: по возрастанию</option>
                    <option value="price-desc">Цена: по убыванию</option>
                    <option value="name-asc">Название: А-Я</option>
                    <option value="name-desc">Название: Я-А</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {showRecommendations && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
                Рекомендации
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendationsData?.recommendations.map((rec) => {
                  const matchingProduct = productsData?.products.find(p => p.id === rec.product_id);
                  const categoryName = categoriesData?.find(c => c.id === rec.category_id)?.name || '';
                  return (
                    <ProductCard
                      key={rec.product_id}
                      product={{
                        id: rec.product_id,
                        name: rec.product_name,
                        category_id: rec.category_id,
                        price: rec.price,
                        image_url: matchingProduct?.image_url || `https://picsum.photos/seed/${rec.product_id}/300/200`,
                        description: rec.reason,
                        stock: matchingProduct?.stock || 0,
                        is_active: matchingProduct?.is_active ?? true,
                        created_at: matchingProduct?.created_at || '',
                        updated_at: matchingProduct?.updated_at || '',
                        category_name: matchingProduct?.category_name || categoryName,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Count */}
          {productsData && (
            <div className="text-sm text-gray-600 mb-4">
              Найдено товаров: {productsData.total}
              {filters.search && (
                <span className="ml-2">
                  по запросу: "{filters.search}"
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : productsData?.products && productsData.products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {productsData.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {productsData.total_pages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(filters.page! - 1)}
                  disabled={filters.page === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, productsData.total_pages) }, (_, i) => {
                    let pageNum;
                    if (productsData.total_pages <= 5) {
                      pageNum = i + 1;
                    } else if (filters.page! <= 3) {
                      pageNum = i + 1;
                    } else if (filters.page! >= productsData.total_pages - 2) {
                      pageNum = productsData.total_pages - 4 + i;
                    } else {
                      pageNum = filters.page! - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg ${
                          filters.page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(filters.page! + 1)}
                  disabled={filters.page === productsData.total_pages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filters.search ? `Товары по запросу "${filters.search}" не найдены` : 'Товары не найдены'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};