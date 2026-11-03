import type { CursorParams } from '@/types/api';
import type { Place, LocationHit, PlaceCursorPage, PlaceDetail, SearchQuery } from '@/types/place';
import { queryNearest } from '@/mocks/places';
import { BaseCursorAPI } from './baseCursorAPI';
import { ENDPOINTS } from './endpoints';

/**
 * Flattens SearchQuery into URL params.
 *
 * `filters` is nested and holds arrays, neither of which survives a flat `key=value` pass:
 * the object stringifies to `[object Object]`. Arrays are emitted as repeated keys
 * (`tag_keys=wifi&tag_keys=aircon`) so Go reads them with `r.URL.Query()["tag_keys"]`.
 *
 * Falsy values are omitted rather than sent as `false`/`all`, which keeps the URL — and so
 * the TanStack cache key — short. An absent flag means false on the server.
 */
function serializeQuery(query: SearchQuery): Record<string, unknown> {
  const { filters } = query;

  return {
    category: query.category === 'all' ? undefined : query.category,
    area_id: query.area_id,
    ward_id: query.ward_id,
    street_id: query.street_id,
    q: query.q,
    sort: query.sort,
    tag_keys: filters.tag_keys.length > 0 ? filters.tag_keys : undefined,
    price_levels: filters.price_levels.length > 0 ? filters.price_levels : undefined,
    cuisines: filters.cuisines.length > 0 ? filters.cuisines : undefined,
    open_now: filters.open_now ? true : undefined,
    open_late: filters.open_late ? true : undefined,
    open_24h: filters.open_24h ? true : undefined,
    radius_m: filters.radius_m,
    min_rating: filters.min_rating,
  };
}

class BasePlaceAPI extends BaseCursorAPI {
  /** One page of results. The cursor is a pagination param, never part of the query. */
  public getPlaces(query: SearchQuery, params: CursorParams = {}): Promise<PlaceCursorPage> {
    return this.getList<Place>(ENDPOINTS.PLACES, {
      ...serializeQuery(query),
      cursor: params.cursor,
      limit: params.limit,
    });
  }

  /** Drives the filter sheet's live "Xem N kết quả" count. */
  public async getPlaceCount(query: SearchQuery): Promise<number> {
    const { count } = await this.get<{ count: number }>(
      ENDPOINTS.PLACES_COUNT,
      serializeQuery(query),
    );

    return count;
  }

  public getPlaceByID(id: string): Promise<PlaceDetail> {
    return this.get<PlaceDetail>(`${ENDPOINTS.PLACES}/${id}`);
  }

  // No screen calls these yet and no endpoint is documented for them — the REST shape below
  // is the assumption, not a settled contract.
  public updatePlaceByID(id: string, updates: Partial<Place>): Promise<Place> {
    return this.patch<Place>(`${ENDPOINTS.PLACES}/${id}`, updates);
  }

  public deletePlaceByID(id: string): Promise<void> {
    return this.delete<void>(`${ENDPOINTS.PLACES}/${id}`);
  }

  /** Diacritic-insensitive area/ward/street search, including former ward names. */
  public searchLocations(term: string): Promise<LocationHit[]> {
    return this.get<LocationHit[]>(ENDPOINTS.LOCATIONS_SEARCH, { q: term });
  }

  /** Still mocked: there is no reverse-geocode endpoint yet. */
  public reverseGeocode(lat: number, lng: number): Promise<{ area_id: string; ward_id: string }> {
    // return this.get(ENDPOINTS.LOCATIONS_REVERSE, { lat, lng });
    return Promise.resolve(queryNearest(lat, lng));
  }
}

export const PlaceAPI = new BasePlaceAPI();
