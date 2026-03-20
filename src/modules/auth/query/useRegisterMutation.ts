import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { AUTH_MUTATION_KEYS } from './auth.query.types';
import { register } from '../api/auth.api';
import type { AuthResponse, RegisterPayload } from '../api/auth.api.types';
import type { AxiosError } from 'axios';

export const useRegisterMutation = (): UseMutationResult<
  AuthResponse,
  AxiosError<{ message: string }>,
  RegisterPayload
> => {
  return useMutation({
    mutationKey: AUTH_MUTATION_KEYS.register,
    mutationFn: (data) => register(data),
  });
};
