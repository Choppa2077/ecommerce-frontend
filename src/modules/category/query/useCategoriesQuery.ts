import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import * as categoryApi from '../api/category.api';
import type { Category } from '../api/category.api.types';

const CATEGORY_QUERY_KEYS = {
  all: ['categories'] as const,
  lists: () => [...CATEGORY_QUERY_KEYS.all, 'list'] as const,
  details: () => [...CATEGORY_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...CATEGORY_QUERY_KEYS.details(), id] as const,
};

export const useCategoriesQuery = (): UseQueryResult<Category[]> => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.lists(),
    queryFn: categoryApi.getCategories,
  });
};

export const useCategoryQuery = (id: number): UseQueryResult<Category> => {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.detail(id),
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
  });
};

export { CATEGORY_QUERY_KEYS };