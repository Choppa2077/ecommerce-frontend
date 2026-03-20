import { api } from '../../../shared/api/apiInstance';
import type { Category } from './category.api.types';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await api.get<Category>(`/categories/${id}`);
  return response.data;
};