import { i18next } from '@/i18n';
import type { ErrorCode, LoginErrorCode } from '@/types/errors';
import { ERROR_CODE, LOGIN_ERROR } from '@/types/errors';

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export const isApiError = (err: unknown): err is ApiRequestError => {
  return err instanceof ApiRequestError;
};

// A code this client does not model degrades to INTERNAL rather than rendering a missing
// i18n key. Codes must arrive as JSON numbers, not strings.
const KNOWN_CODES: ReadonlySet<number> = new Set(Object.values(ERROR_CODE));

function readErrorBody(body: unknown): { code: ErrorCode | null; message: string | null } {
  const { error } = (body ?? {}) as { error?: unknown };
  const { code, message } = (error ?? {}) as { code?: unknown; message?: unknown };

  return {
    code: typeof code === 'number' && KNOWN_CODES.has(code) ? (code as ErrorCode) : null,
    message: typeof message === 'string' ? message : null,
  };
}

export function toApiError(err: unknown): ApiRequestError {
  if (isApiError(err)) {
    return err;
  }

  const maybeAxios = err as {
    response?: { status?: number; data?: unknown };
    request?: unknown;
    message?: string;
  };

  // `message` is the backend's Vietnamese text, kept for debugging only. Render
  // `messageFor(err)` in the UI, never `err.message`.
  if (maybeAxios?.response) {
    const body = readErrorBody(maybeAxios.response.data);
    const code = body.code ?? ERROR_CODE.INTERNAL;
    return new ApiRequestError(
      maybeAxios.response.status ?? 500,
      code,
      body.message ?? String(code),
    );
  }

  if (maybeAxios?.request) {
    return new ApiRequestError(0, ERROR_CODE.INTERNAL, 'Could not reach the server.');
  }

  return new ApiRequestError(0, ERROR_CODE.INTERNAL, maybeAxios?.message ?? 'Unknown error');
}

// The backend replies in Vietnamese and `err.message` is kept for debugging only — always
// render this instead, which resolves the code through the active locale.
export const messageFor = (err: unknown): string => {
  const code = isApiError(err) ? err.code : ERROR_CODE.INTERNAL;

  return i18next.t(`apiError.${code}`);
};

const KNOWN_LOGIN_CODES: ReadonlySet<number> = new Set(Object.values(LOGIN_ERROR));

// `?error=` is untrusted input and always a string, so it is coerced and checked against
// the known set. Anything else — empty, non-numeric, an unmodelled code — yields null and
// the page renders no error banner at all.
export const parseLoginErrorCode = (value: string | null): LoginErrorCode | null => {
  if (value === null || !/^\d+$/.test(value)) {
    return null;
  }

  const code = Number(value);

  return KNOWN_LOGIN_CODES.has(code) ? (code as LoginErrorCode) : null;
};

export const loginErrorMessage = (code: LoginErrorCode): string => {
  return i18next.t(`loginError.${code}`);
};
