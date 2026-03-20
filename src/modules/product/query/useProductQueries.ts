import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as productApi from '../api/product.api';
import type { InteractionResponse, LikedResponse, Product, ProductListParams, ProductListResponse, ProductStatistics, PurchasedResponse, PurchasePayload } from '../api/product.api.types';
import { PROFILE_QUERY_KEYS } from '../../profile/query/useProfileQueries';

const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (params?: ProductListParams) =>
    [...PRODUCT_QUERY_KEYS.lists(), params] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
  statistics: (id: number) =>
    [...PRODUCT_QUERY_KEYS.detail(id), 'statistics'] as const,
  liked: (id: number) => [...PRODUCT_QUERY_KEYS.detail(id), 'liked'] as const,
  purchased: (id: number) =>
    [...PRODUCT_QUERY_KEYS.detail(id), 'purchased'] as const,
};

// Product list query
export const useProductsQuery = (
  params?: ProductListParams
): UseQueryResult<ProductListResponse> => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: () => productApi.getProducts(params),
  });
};

// Product detail query
export const useProductQuery = (
  id: number
): UseQueryResult<Product> => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });
};

// Product statistics query
export const useProductStatisticsQuery = (
  id: number
): UseQueryResult<ProductStatistics> => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.statistics(id),
    queryFn: () => productApi.getProductStatistics(id),
    enabled: !!id,
  });
};

// Check if product is liked
export const useProductLikedQuery = (
  id: number
): UseQueryResult<LikedResponse> => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.liked(id),
    queryFn: () => productApi.checkIfLiked(id),
    enabled: !!id,
  });
};

// Check if product is purchased
export const useProductPurchasedQuery = (
  id: number
): UseQueryResult<PurchasedResponse> => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.purchased(id),
    queryFn: () => productApi.checkIfPurchased(id),
    enabled: !!id,
  });
};

// View product mutation
export const useViewProductMutation = (): UseMutationResult<
  InteractionResponse,
  Error,
  number
> => {
  return useMutation({
    mutationFn: (id: number) => productApi.viewProduct(id),
  });
};

// Like/Unlike product mutation
export const useLikeProductMutation = (): UseMutationResult<
  InteractionResponse,
  Error,
  { id: number; isLiked: boolean }
> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isLiked }) =>
      isLiked ? productApi.unlikeProduct(id) : productApi.likeProduct(id),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.liked(id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.statistics(id) });
      queryClient.invalidateQueries({queryKey: PROFILE_QUERY_KEYS.likes()})
    },
  });
};

// Purchase product mutation
export const usePurchaseProductMutation = (): UseMutationResult<
  InteractionResponse,
  Error,
  { id: number; data: PurchasePayload }
> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => productApi.purchaseProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.purchased(id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.statistics(id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(id) });
    },
  });
};

export { PRODUCT_QUERY_KEYS };