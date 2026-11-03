export { default as axiosInstance } from './axios';
import type { AxiosRequestConfig } from 'axios';
import axiosInstance from './axios';
import type { CursorResponse } from '@/types/api';

export interface CursorAPI {
  getList<T>(
    url: string,
    params?: object,
    options?: AxiosRequestConfig,
  ): Promise<CursorResponse<T>>;
  get<T>(url: string, params?: object, options?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, input?: object, options?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, input?: object, options?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, input?: object, options?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, options?: AxiosRequestConfig): Promise<T>;
}

export function serializeParams(params?: object): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        search.append(key, String(entry));
      }
      continue;
    }

    search.append(key, String(value));
  }

  return search.toString();
}

function withQuery(url: string, params?: object): string {
  const search = serializeParams(params);

  return search === '' ? url : `${url}?${search}`;
}

export class BaseCursorAPI implements CursorAPI {
  // Auth and recommendations are separate services on separate origins, so each API
  // overrides the shared instance's baseURL per request. One instance keeps the CSRF and
  // 401 interceptors applying to both.
  constructor(private readonly baseURL?: string) {}

  private config(options?: AxiosRequestConfig): AxiosRequestConfig {
    if (this.baseURL === undefined) {
      return { ...options };
    }

    return { baseURL: this.baseURL, ...options };
  }

  public async getList<T>(
    url: string,
    params?: object,
    options?: AxiosRequestConfig,
  ): Promise<CursorResponse<T>> {
    const { data } = await axiosInstance.get<CursorResponse<T>>(
      withQuery(url, params),
      this.config(options),
    );

    return {
      items: data.items ?? [],
      total: data.total,
      limit: data.limit,
      next_cursor: data.next_cursor,
    };
  }

  public async get<T>(url: string, params?: object, options?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.get<T>(withQuery(url, params), this.config(options));

    return data;
  }

  public async post<T>(url: string, input?: object, options?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.post<T>(url, input, this.config(options));

    return data;
  }

  public async patch<T>(url: string, input?: object, options?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.patch<T>(url, input, this.config(options));

    return data;
  }

  public async put<T>(url: string, input?: object, options?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.put<T>(url, input, this.config(options));

    return data;
  }

  public async delete<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.delete<T>(url, this.config(options));

    return data;
  }
}
