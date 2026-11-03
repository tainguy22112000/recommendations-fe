import { useSearchParams } from 'react-router-dom';

import { loginErrorMessage, parseLoginErrorCode } from '@/lib/errors';
import type { LoginErrorCode } from '@/types/errors';

interface LoginError {
  code: LoginErrorCode;
  message: string;
}

export function useLoginError(): LoginError | null {
  const [params] = useSearchParams();
  const code = parseLoginErrorCode(params.get('error'));

  if (code === null) {
    return null;
  }

  return { code, message: loginErrorMessage(code) };
}
