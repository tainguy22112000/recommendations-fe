import type { ApiEnvelope } from '@/types/api';
import type { MeResponse } from '@/types/auth';
import { BaseCursorAPI, serializeParams } from './baseCursorAPI';
import { APP_ID, APP_ID_PARAM, AUTH_API_BASE, ENDPOINTS } from './endpoints';

class BaseAuthAPI extends BaseCursorAPI {
  constructor() {
    super(AUTH_API_BASE);
  }

  getGoogleSignInURL(): string {
    const url = `${AUTH_API_BASE}${ENDPOINTS.AUTH_GOOGLE_LOGIN}`;
    const query = serializeParams({ [APP_ID_PARAM]: APP_ID });

    if (query === '') {
      return url;
    }

    return `${url}?${query}`;
  }
  async fetchMe(): Promise<MeResponse> {
    const { data } = await this.get<ApiEnvelope<MeResponse>>(ENDPOINTS.ME);
    return data;
  }
  async logout(): Promise<void> {
    return this.post<void>(ENDPOINTS.AUTH_LOGOUT);
  }
}

export const AuthAPI = new BaseAuthAPI();
