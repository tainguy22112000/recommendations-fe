import type { CursorResponse } from './api';

export type Category = 'food' | 'cafe';
export type PriceLevel = 1 | 2 | 3;
export type RadiusM = 500 | 1000 | 3000 | 5000;
export type MinRating = 3.5 | 4 | 4.5;

export type SortKey =
  'relevant' | 'nearest' | 'rating' | 'price_asc' | 'price_desc' | 'newest' | 'name' | 'open_first';

export interface Place {
  id: string;
  name: string;
  category: Category;
  rating: number | null;
  review_count: number;
  price_level: PriceLevel;
  avg_price_per_person: number; // VND
  distance_m: number;
  street: string;
  area_id: string;
  is_open: boolean;
  closes_at?: string; // 'HH:mm' wall clock, no timezone
  opens_at?: string;
  is_24h: boolean;
  cover_photo_url?: string;
  cover_caption?: string;
  tags: string[]; // tag keys, resolved through i18n `tag.*`
  cuisine?: string | null; // cuisine key, resolved through i18n `cuisine.*`
  status: 'approved' | 'pending';
  is_saved: boolean;
  lat: number;
  lng: number;
}

export interface SearchFilters {
  tag_keys: string[];
  price_levels: PriceLevel[];
  cuisines: string[];
  open_now: boolean;
  open_late: boolean;
  open_24h: boolean;
  radius_m?: RadiusM;
  min_rating?: MinRating;
}

export interface SearchQuery {
  category: 'all' | Category;
  area_id?: string;
  ward_id?: string;
  street_id?: string;
  q?: string;
  filters: SearchFilters;
  sort: SortKey;
}

export type PlaceCursorPage = CursorResponse<Place>;

export type MediaCategory = 'food' | 'space' | 'menu' | 'video';

export interface MediaItem {
  id: string;
  url: string;
  category: MediaCategory;
  caption: string;
  is_video: boolean;
  duration_sec?: number;
  source: 'owner' | 'guest';
}

export interface PlaceDetail extends Place {
  address: string;
  district: string;
  media: MediaItem[];
}

export interface Area {
  id: string;
  name: string;
  ward_count: number;
}

export interface Ward {
  id: string;
  area_id: string;
  name: string;
  old_name?: string;
}

export interface Street {
  id: string;
  ward_id: string;
  name: string;
}

// A search hit is one of three levels. `matched_old_name` is what earns the "Tên mới" badge:
// it tells the user why an unfamiliar ward matched the name they typed.
export type LocationHit =
  | { kind: 'area'; area: Area }
  | { kind: 'ward'; ward: Ward; area: Area; matched_old_name: boolean }
  | { kind: 'street'; street: Street; ward: Ward; area: Area };

export interface LocationSelection {
  area_id?: string;
  ward_id?: string;
  street_id?: string;
  label: string;
}
