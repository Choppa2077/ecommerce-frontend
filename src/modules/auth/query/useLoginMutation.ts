import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { AUTH_MUTATION_KEYS } from './auth.query.types';
import { login } from '../api/auth.api';
import type { AuthResponse, LoginPayload } from '../api/auth.api.types';
import type { AxiosError } from 'axios';
import { PROFILE_QUERY_KEYS } from '../../profile/query/useProfileQueries';

export const useLoginMutation = (): UseMutationResult<
  AuthResponse,
  AxiosError<{ message: string }>,
  LoginPayload
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: AUTH_MUTATION_KEYS.login,
    mutationFn: (data) => login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all });
    },
  });
};
