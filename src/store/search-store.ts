import { useMemo } from 'react';
import { create } from 'zustand';

import { DEFAULT_QUERY } from '@/lib/search';
import { AREAS, STREETS, WARDS } from '@/mocks/places';
import type { SearchQuery } from '@/types/place';

const DEFAULT_ORIGIN = 'Võ Văn Tần';

interface SearchState {
  query: SearchQuery;
  /** Takes an updater so a stale closure cannot clobber a newer query. */
  update: (next: (current: SearchQuery) => SearchQuery) => void;
  reset: () => void;
}

// One SearchQuery for the whole app. Quick chips, the active-chip row, the filter sheet,
// the sort sheet and (from R3) the table headers all read and write this object — a second
// copy would drift and the UI would start misreporting what is filtered.
//
// A module-level store rather than a provider: no tree position to get wrong, and the state
// is reachable from outside React, which the map view (R2) and the spin feature (R3) need
// when they pick results without a component in scope.
export const useSearchStore = create<SearchState>()((set) => {
  return {
    query: DEFAULT_QUERY,
    update: (next) => {
      return set((state) => {
        return { query: next(state.query) };
      });
    },
    reset: () => {
      return set({ query: DEFAULT_QUERY });
    },
  };
});

function describe(query: SearchQuery): { locationLabel: string; originLabel: string } {
  const area = AREAS.find((candidate) => {
    return candidate.id === query.area_id;
  });
  const ward = WARDS.find((candidate) => {
    return candidate.id === query.ward_id;
  });
  const street = STREETS.find((candidate) => {
    return candidate.id === query.street_id;
  });

  const parts = [area?.name, street?.name ?? ward?.name].filter((part) => {
    return part !== undefined;
  });

  return {
    locationLabel: parts.length > 0 ? parts.join(' · ') : DEFAULT_ORIGIN,
    originLabel: street?.name ?? DEFAULT_ORIGIN,
  };
}

// Each value is selected atomically. A selector returning a fresh object would fail
// zustand's Object.is check on every store write and re-render all consumers.
export function useSearch(): Pick<SearchState, 'query' | 'update'> & ReturnType<typeof describe> {
  const query = useSearchStore((state) => {
    return state.query;
  });
  const update = useSearchStore((state) => {
    return state.update;
  });

  // Derived from the query, so the label can never disagree with what is filtered.
  const labels = useMemo(() => {
    return describe(query);
  }, [query]);

  return { query, update, ...labels };
}
