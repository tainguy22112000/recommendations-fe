import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { AuthAPI } from '@/api/authAPI';
import { LOGIN_PATH } from '@/lib/navigate';
import type { MeResponse } from '@/types/auth';

export const ME_QUERY_KEY = ['me'] as const;

export function useMe(): UseQueryResult<MeResponse> {
  return useQuery<MeResponse>({
    queryKey: ME_QUERY_KEY,
    queryFn: () => {
      return AuthAPI.fetchMe();
    },
    retry: false,
  });
}

export function useLogout(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      return AuthAPI.logout();
    },
    onSettled: () => {
      queryClient.clear();
      void navigate(LOGIN_PATH, { replace: true });
    },
  });
}
