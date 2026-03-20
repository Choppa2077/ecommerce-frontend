import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import * as profileApi from '../api/profile.api';
import type {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
  RecommendationResponse,
  UserInteraction,
  LikesResponse,
} from '../api/profile.api.types';

const PROFILE_QUERY_KEYS = {
  all: ['profile'] as const,
  me: () => [...PROFILE_QUERY_KEYS.all, 'me'] as const,
  recommendations: (limit?: number) => 
    [...PROFILE_QUERY_KEYS.all, 'recommendations', limit] as const,
  interactions: () => [...PROFILE_QUERY_KEYS.all, 'interactions'] as const,
  views: () => [...PROFILE_QUERY_KEYS.interactions(), 'views'] as const,
  likes: () => [...PROFILE_QUERY_KEYS.interactions(), 'likes'] as const,
  purchases: () => [...PROFILE_QUERY_KEYS.interactions(), 'purchases'] as const,
  similar: () => [...PROFILE_QUERY_KEYS.all, 'similar'] as const,
};

// Profile queries
export const useProfileQuery = (): UseQueryResult<UserProfile> => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.me(),
    queryFn: profileApi.getMyProfile,
  });
};

export const useRecommendationsQuery = (
  limit = 10
): UseQueryResult<RecommendationResponse> => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.recommendations(limit),
    queryFn: () => profileApi.getRecommendations(limit),
  });
};

export const useInteractionsQuery = (): UseQueryResult<UserInteraction[]> => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.interactions(),
    queryFn: profileApi.getMyInteractions,
  });
};

export const useViewsQuery = (): UseQueryResult<UserInteraction[]> => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.views(),
    queryFn: profileApi.getMyViews,
  });
};

export const useLikesQuery = (): UseQueryResult<LikesResponse> => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.likes(),
    queryFn: profileApi.getMyLikes,
    
  });
};

export const usePurchasesQuery = (): UseQueryResult<UserInteraction[]> => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.purchases(),
    queryFn: profileApi.getMyPurchases,
  });
};

export const useSimilarUsersQuery = (): UseQueryResult<
  Array<{ user_id: number; similarity_score: number }>
> => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.similar(),
    queryFn: profileApi.getSimilarUsers,
  });
};

// Profile mutations
export const useUpdateProfileMutation = (): UseMutationResult<
  UserProfile,
  Error,
  UpdateProfilePayload
> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.me() });
    },
  });
};

export const useChangePasswordMutation = (): UseMutationResult<
  { message: string },
  Error,
  ChangePasswordPayload
> => {
  return useMutation({
    mutationFn: profileApi.changePassword,
  });
};


export { PROFILE_QUERY_KEYS };