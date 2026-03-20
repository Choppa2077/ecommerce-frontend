import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { clearAuthTokens, setAccessToken } from './authTokenManager';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        refreshToken: null,
        setAccessToken: (token) => {
          set({ accessToken: token });
          setAccessToken(token); // Синхронизируем с менеджером
        },
        setRefreshToken: (token) => {
          set({ refreshToken: token });
          // Refresh token также может понадобиться в менеджере
        },
        clearTokens: () => {
          set({ accessToken: null, refreshToken: null });
          clearAuthTokens(); // Синхронизируем с менеджером
        },
      }),
      {
        name: 'authStore',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

export function useAuthStateSelector(): AuthState {
  return useAuthStore(useShallow((state) => state));
}