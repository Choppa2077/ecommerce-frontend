import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { PRODUCT_QUERY_KEYS, useProductsQuery } from '../modules/product/query/useProductQueries';
import { useQueries } from '@tanstack/react-query';
import { checkIfPurchased } from '../modules/product/api/product.api';
import { ProductCard } from '../modules/product/ui/ProductCard';

export const PurchaseHistoryPage = () => {
  // Fetch all products with a high limit (assuming not too many products)
  const { data: productsData, isLoading: productsLoading } = useProductsQuery({
    page: 1,
    limit: 1000, // Set high limit to fetch all; adjust if needed
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  // Use useQueries to check purchased status for each product
  const purchasedQueries = useQueries({
    queries: (productsData?.products || []).map((product) => ({
      queryKey: PRODUCT_QUERY_KEYS.purchased(product.id),
      queryFn: () => checkIfPurchased(product.id),
      enabled: !!productsData,
    })),
  });

  // Filter purchased products
  const purchasedProducts = useMemo(() => {
    return (productsData?.products || []).filter((_product, index) => {
      const query = purchasedQueries[index];
      return query.data?.purchased === true;
    });
  }, [productsData, purchasedQueries]);

  const isLoading =
    productsLoading || purchasedQueries.some((q) => q.isLoading);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          История покупок
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : purchasedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchasedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Покупок пока нет</p>
          </div>
        )}
      </div>
    </div>
  );
};
