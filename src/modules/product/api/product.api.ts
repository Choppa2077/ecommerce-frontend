import { api } from '../../../shared/api/apiInstance';
import type { InteractionResponse, LikedResponse, Product, ProductListParams, ProductListResponse, ProductStatistics, PurchasedResponse, PurchasePayload } from './product.api.types';

export const getProducts = async (
  params?: ProductListParams
): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>('/products', { params });
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const getProductStatistics = async (
  id: number
): Promise<ProductStatistics> => {
  const response = await api.get<ProductStatistics>(
    `/products/${id}/statistics`
  );
  return response.data;
};

// Interaction operations
export const viewProduct = async (
  id: number
): Promise<InteractionResponse> => {
  const response = await api.post<InteractionResponse>(
    `/products/${id}/view`
  );
  return response.data;
};

export const likeProduct = async (
  id: number
): Promise<InteractionResponse> => {
  const response = await api.post<InteractionResponse>(
    `/products/${id}/like`
  );
  return response.data;
};

export const unlikeProduct = async (
  id: number
): Promise<InteractionResponse> => {
  const response = await api.delete<InteractionResponse>(
    `/products/${id}/like`
  );
  return response.data;
};

export const checkIfLiked = async (id: number): Promise<LikedResponse> => {
  const response = await api.get<LikedResponse>(`/products/${id}/liked`);
  return response.data;
};

export const purchaseProduct = async (
  id: number,
  data: PurchasePayload
): Promise<InteractionResponse> => {
  const response = await api.post<InteractionResponse>(
    `/products/${id}/purchase`,
    data
  );
  return response.data;
};

export const checkIfPurchased = async (
  id: number
): Promise<PurchasedResponse> => {
  const response = await api.get<PurchasedResponse>(
    `/products/${id}/purchased`
  );
  return response.data;
};