import type { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { PlaceAPI } from '@/api/placesAPI';
import type { LocationHit, PlaceDetail, PlaceCursorPage, SearchQuery } from '@/types/place';
import { useDebouncedValue } from './useDebouncedValue';

export function usePlaces(
  query: SearchQuery,
): UseInfiniteQueryResult<InfiniteData<PlaceCursorPage>> {
  return useInfiniteQuery({
    queryKey: ['places', query],
    queryFn: ({ pageParam }) => {
      return PlaceAPI.getPlaces(query, { cursor: pageParam });
    },
    initialPageParam: undefined as string | undefined,
    // undefined is what sets hasNextPage to false, so next_cursor's null must be mapped.
    getNextPageParam: (lastPage: PlaceCursorPage) => {
      return lastPage.next_cursor ?? undefined;
    },
  });
}

// Drives the filter sheet's "Xem N kết quả" button. Debounced at 250ms per the design.
export function usePlaceCount(query: SearchQuery, enabled: boolean): UseQueryResult<number> {
  const debounced = useDebouncedValue(query, 250);

  return useQuery({
    queryKey: ['places', 'count', debounced],
    queryFn: () => {
      return PlaceAPI.getPlaceCount(debounced);
    },
    enabled,
  });
}

export function usePlace(id: string): UseQueryResult<PlaceDetail> {
  return useQuery({
    queryKey: ['place', id],
    queryFn: () => {
      return PlaceAPI.getPlaceByID(id);
    },
  });
}

export function useLocationSearch(term: string): UseQueryResult<LocationHit[]> {
  const debounced = useDebouncedValue(term, 250);

  return useQuery({
    queryKey: ['locations', debounced],
    queryFn: () => {
      return PlaceAPI.searchLocations(debounced);
    },
    enabled: debounced.trim() !== '',
  });
}
