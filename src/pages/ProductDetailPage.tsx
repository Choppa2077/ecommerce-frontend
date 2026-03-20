import { useParams, Navigate } from 'react-router-dom';
import { useProductQuery } from '../modules/product/query/useProductQueries';
import { useViewProductMutation } from '../modules/product/query/useProductQueries';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ProductDetail } from '../modules/product/ui/ProductDetail';

export const ProductDetailPage = () => {
  return <ProductDetail />;
};
