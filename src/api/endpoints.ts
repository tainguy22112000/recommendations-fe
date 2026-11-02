export const BASE_ENDPOINT_PREFIX_V1 = '/api/v1';
export const BASE_ENDPOINT_PREFIX_V2 = '/api/v2';

export const ENDPOINTS = {
  AUTH_GOOGLE_LOGIN: `${BASE_ENDPOINT_PREFIX_V1}/auth/google/login`,
  AUTH_LOGOUT: `${BASE_ENDPOINT_PREFIX_V1}/auth/logout`,
  ME: `${BASE_ENDPOINT_PREFIX_V1}/api/me`,
  PLACES: `${BASE_ENDPOINT_PREFIX_V1}/places`,
  PLACES_COUNT: `${BASE_ENDPOINT_PREFIX_V1}/places/count`,
  LOCATIONS_SEARCH: `${BASE_ENDPOINT_PREFIX_V1}/locations/search`,
} as const;

export const AUTH_API_BASE: string = import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:9999';
export const RECOMMENDATIONS_API_BASE: string =
  import.meta.env.VITE_RECOMMENDATIONS_API_URL ?? 'http://localhost:9998';

export const APP_ID: string = import.meta.env.VITE_RECOMMENDATION_APP_ID || '';

// Sent as a header on XHR calls; a full-page navigation (Google sign-in) cannot set
// headers, so it carries the same value as a query param instead.
export const APP_ID_HEADER = 'app-id';
export const APP_ID_PARAM = 'app_id';
