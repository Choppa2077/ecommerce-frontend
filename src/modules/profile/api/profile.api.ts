import { api } from '../../../shared/api/apiInstance';
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
  RecommendationResponse,
  UserInteraction,
  UserProfile,
  LikesResponse,
} from './profile.api.types';

// Profile management
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/profiles/me');
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfilePayload
): Promise<UserProfile> => {
  const response = await api.put<UserProfile>('/profiles/me', data);
  return response.data;
};

export const changePassword = async (
  data: ChangePasswordPayload
): Promise<{ message: string }> => {
  const response = await api.put<{ message: string }>(
    '/profiles/me/password',
    data
  );
  return response.data;
};


// Recommendations
export const getRecommendations = async (
  limit = 10
): Promise<RecommendationResponse> => {
  const response = await api.get<RecommendationResponse>(
    '/profiles/me/recommendations',
    { params: { limit } }
  );
  return response.data;
};

// User interactions history
export const getMyInteractions = async (): Promise<UserInteraction[]> => {
  const response = await api.get<UserInteraction[]>('/profiles/me/interactions');
  return response.data;
};

export const getMyViews = async (): Promise<UserInteraction[]> => {
  const response = await api.get<UserInteraction[]>('/profiles/me/views');
  return response.data;
};

export const getMyLikes = async (): Promise<LikesResponse> => {
  const response = await api.get<LikesResponse>('/profiles/me/likes');
  return response.data;
};

export const getMyPurchases = async (): Promise<UserInteraction[]> => {
  const response = await api.get<UserInteraction[]>('/users/me/purchases');
  return response.data;
};

export const getSimilarUsers = async (): Promise<
  Array<{ user_id: number; similarity_score: number }>
> => {
  const response = await api.get<
    Array<{ user_id: number; similarity_score: number }>
  >('/users/me/similar');
  return response.data;
};