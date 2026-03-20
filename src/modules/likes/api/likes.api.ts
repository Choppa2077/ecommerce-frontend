import { api } from "../../../shared/api/apiInstance";
import type { LikesResponse } from "./likes.api.types";

export const getMyLikes = async (): Promise<LikesResponse> => {
  const response = await api.get<LikesResponse>('/profiles/me/likes');
  return response.data;
};
