import type {
  Category,
  MinRating,
  PriceLevel,
  RadiusM,
  SearchFilters,
  SearchQuery,
  SortKey,
} from '@/types/place';

export const DEFAULT_FILTERS: SearchFilters = {
  tag_keys: [],
  price_levels: [],
  cuisines: [],
  open_now: false,
  open_late: false,
  open_24h: false,
};

// Defaults to a district rather than a street: an area gives a useful first result set,
// while a street would filter down to a handful before the user has chosen anything.
export const DEFAULT_QUERY: SearchQuery = {
  category: 'all',
  area_id: 'q3',
  filters: DEFAULT_FILTERS,
  sort: 'relevant',
};

export const SORT_KEYS: SortKey[] = [
  'relevant',
  'nearest',
  'rating',
  'price_asc',
  'price_desc',
  'newest',
];

export const SORT_LABEL_KEYS: Record<SortKey, string> = {
  relevant: 'sort.relevant',
  nearest: 'sort.nearest',
  rating: 'sort.rating',
  price_asc: 'sort.priceAsc',
  price_desc: 'sort.priceDesc',
  newest: 'sort.newest',
  name: 'sort.relevant',
  open_first: 'sort.relevant',
};

export const CUISINE_KEYS = ['pho', 'bun', 'comtam', 'banhmi', 'lau', 'nuong', 'chay', 'haisan'];
export const AMENITY_KEYS = ['wifi', 'aircon', 'parking', 'outdoor', 'quiet', 'group'];
export const VIBE_KEYS = ['work', 'quiet', 'outdoor', 'wifi'];
export const RADIUS_OPTIONS: RadiusM[] = [500, 1000, 3000, 5000];
export const MIN_RATING_OPTIONS: MinRating[] = [3.5, 4, 4.5];
export const PRICE_LEVELS: PriceLevel[] = [1, 2, 3];

function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((entry) => {
        return entry !== value;
      })
    : [...list, value];
}

export function withCategory(query: SearchQuery, category: 'all' | Category): SearchQuery {
  return { ...query, category };
}

export function withSort(query: SearchQuery, sort: SortKey): SearchQuery {
  return { ...query, sort };
}

export function withSearchTerm(query: SearchQuery, q: string): SearchQuery {
  return { ...query, q: q === '' ? undefined : q };
}

export function withFilters(query: SearchQuery, patch: Partial<SearchFilters>): SearchQuery {
  return { ...query, filters: { ...query.filters, ...patch } };
}

export function withTag(query: SearchQuery, tagKey: string): SearchQuery {
  return withFilters(query, { tag_keys: toggleIn(query.filters.tag_keys, tagKey) });
}

export function withPriceLevel(query: SearchQuery, level: PriceLevel): SearchQuery {
  return withFilters(query, { price_levels: toggleIn(query.filters.price_levels, level) });
}

export function withCuisine(query: SearchQuery, cuisine: string): SearchQuery {
  return withFilters(query, { cuisines: toggleIn(query.filters.cuisines, cuisine) });
}

// Tapping the selected radius clears it, per the design.
export function withRadius(query: SearchQuery, radius_m: RadiusM): SearchQuery {
  return withFilters(query, {
    radius_m: query.filters.radius_m === radius_m ? undefined : radius_m,
  });
}

export function withMinRating(query: SearchQuery, min_rating: MinRating | undefined): SearchQuery {
  return withFilters(query, {
    min_rating: query.filters.min_rating === min_rating ? undefined : min_rating,
  });
}

export function withLocation(
  query: SearchQuery,
  location: { area_id?: string; ward_id?: string; street_id?: string },
): SearchQuery {
  return {
    ...query,
    area_id: location.area_id,
    ward_id: location.ward_id,
    street_id: location.street_id,
  };
}

export function clearFilters(query: SearchQuery): SearchQuery {
  return { ...query, filters: DEFAULT_FILTERS };
}

export function countActiveFilters(filters: SearchFilters): number {
  let count = filters.tag_keys.length + filters.price_levels.length + filters.cuisines.length;

  if (filters.open_now) {
    count += 1;
  }
  if (filters.open_late) {
    count += 1;
  }
  if (filters.open_24h) {
    count += 1;
  }
  if (filters.radius_m !== undefined) {
    count += 1;
  }
  if (filters.min_rating !== undefined) {
    count += 1;
  }

  return count;
}

// The quick chips are a *view* over SearchQuery, not a parallel state: each one reads and
// writes the same field the filter sheet does, which is why toggling a chip updates the
// sheet and the active-chip row with no synchronisation code.
export interface QuickFilter {
  id: string;
  labelKey: string;
  isActive: (query: SearchQuery) => boolean;
  toggle: (query: SearchQuery) => SearchQuery;
}

export const QUICK_FILTERS: QuickFilter[] = [
  {
    id: 'open_now',
    labelKey: 'quick.openNow',
    isActive: (query: SearchQuery): boolean => {
      return query.filters.open_now;
    },
    toggle: (query: SearchQuery): SearchQuery => {
      return withFilters(query, { open_now: !query.filters.open_now });
    },
  },
  {
    id: 'cheap',
    labelKey: 'quick.cheap',
    isActive: (query: SearchQuery): boolean => {
      return query.filters.price_levels.includes(1);
    },
    toggle: (query: SearchQuery): SearchQuery => {
      return withPriceLevel(query, 1);
    },
  },
  {
    id: 'aircon',
    labelKey: 'quick.aircon',
    isActive: (query: SearchQuery): boolean => {
      return query.filters.tag_keys.includes('aircon');
    },
    toggle: (query: SearchQuery): SearchQuery => {
      return withTag(query, 'aircon');
    },
  },
  {
    id: 'work',
    labelKey: 'quick.work',
    isActive: (query: SearchQuery): boolean => {
      return query.filters.tag_keys.includes('work');
    },
    toggle: (query: SearchQuery): SearchQuery => {
      return withTag(query, 'work');
    },
  },
  {
    id: 'parking',
    labelKey: 'quick.parking',
    isActive: (query: SearchQuery): boolean => {
      return query.filters.tag_keys.includes('parking');
    },
    toggle: (query: SearchQuery): SearchQuery => {
      return withTag(query, 'parking');
    },
  },
  {
    id: 'rating45',
    labelKey: 'quick.rating45',
    isActive: (query: SearchQuery): boolean => {
      return query.filters.min_rating === 4.5;
    },
    toggle: (query: SearchQuery): SearchQuery => {
      return withMinRating(query, 4.5);
    },
  },
];

export interface ActiveChip {
  id: string;
  labelKey: string;
  params?: Record<string, string | number>;
  remove: (query: SearchQuery) => SearchQuery;
}

// Every active filter gets a chip — including sheet-only ones like radius and minimum
// rating. Otherwise a user who narrowed to 1 km in the sheet sees a short list with no
// visible explanation.
export function activeChips(query: SearchQuery): ActiveChip[] {
  const { filters } = query;
  const chips: ActiveChip[] = [];

  for (const level of filters.price_levels) {
    chips.push({
      id: `price-${level}`,
      labelKey: `filter.priceHint${level}`,
      remove: (current) => {
        return withPriceLevel(current, level);
      },
    });
  }

  for (const cuisine of filters.cuisines) {
    chips.push({
      id: `cuisine-${cuisine}`,
      labelKey: `cuisine.${cuisine}`,
      remove: (current) => {
        return withCuisine(current, cuisine);
      },
    });
  }

  for (const tagKey of filters.tag_keys) {
    chips.push({
      id: `tag-${tagKey}`,
      labelKey: `tag.${tagKey}`,
      remove: (current) => {
        return withTag(current, tagKey);
      },
    });
  }

  if (filters.open_now) {
    chips.push({
      id: 'open_now',
      labelKey: 'filter.openNow',
      remove: (current) => {
        return withFilters(current, { open_now: false });
      },
    });
  }

  if (filters.open_late) {
    chips.push({
      id: 'open_late',
      labelKey: 'filter.openLate',
      remove: (current) => {
        return withFilters(current, { open_late: false });
      },
    });
  }

  if (filters.open_24h) {
    chips.push({
      id: 'open_24h',
      labelKey: 'filter.open24h',
      remove: (current) => {
        return withFilters(current, { open_24h: false });
      },
    });
  }

  if (filters.radius_m !== undefined) {
    const radius = filters.radius_m;
    chips.push({
      id: 'radius',
      labelKey: 'filter.distance',
      remove: (current) => {
        return withRadius(current, radius);
      },
    });
  }

  if (filters.min_rating !== undefined) {
    const rating = filters.min_rating;
    chips.push({
      id: 'min_rating',
      labelKey: 'filter.minRating',
      remove: (current) => {
        return withMinRating(current, rating);
      },
    });
  }

  return chips;
}
