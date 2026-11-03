export interface ApiEnvelope<T> {
  session_id: string;
  count: number | null;
  data: T;
  metadata?: unknown;
}

export interface BaseResponseList<T> {
  items: T[];
  limit: number;
  total?: number;
}

export interface CursorResponse<T> extends BaseResponseList<T> {
  next_cursor?: string;
}

export interface CursorParams {
  cursor?: string;
  limit?: number;
}
