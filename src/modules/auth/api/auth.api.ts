import axios from 'axios';
import { api } from '../../../shared/api/apiInstance';
import { useAuthStore } from '../store/useAuthStore';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from './auth.api.types';
import { refreshAxios } from './refreshAxios';

let refreshPromise: Promise<string | null> | null = null;

export const register = async (
  data: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const refreshTokenMarket = async (): Promise<string | null> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = performRefresh();

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    refreshPromise = null;
  }
};

const performRefresh = async (): Promise<string | null> => {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    console.log('No refresh token available. Cannot refresh.');
    return null;
  }

  try {
    console.log('🔄 Attempting to refresh token...');
    const response = await refreshAxios.post<AuthResponse>(
      '/auth/refresh',
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { access_token, refresh_token: newRefreshToken } = response.data;

    useAuthStore.getState().setAccessToken(access_token);
    if (newRefreshToken) {
      useAuthStore.getState().setRefreshToken(newRefreshToken);
    }

    console.log('Token refreshed successfully');
    return access_token;
  } catch (error) {
    console.log('Failed to refresh token:', error);
    if (axios.isAxiosError(error)) {
      console.log('Refresh error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
    }

    useAuthStore.getState().clearTokens();
    return null;
  }
};