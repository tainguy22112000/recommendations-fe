import { describe, expect, it } from 'vitest';

import {
  clearFilters,
  countActiveFilters,
  DEFAULT_FILTERS,
  DEFAULT_QUERY,
  withFilters,
  withLocation,
  withRadius,
  withTag,
} from './search';

describe('withFilters', () => {
  it('patches filters without mutating the input', () => {
    const next = withFilters(DEFAULT_QUERY, { open_now: true });

    expect(next.filters.open_now).toBe(true);
    expect(DEFAULT_QUERY.filters.open_now).toBe(false);
  });
});

describe('withTag', () => {
  it('toggles a tag on and off', () => {
    const on = withTag(DEFAULT_QUERY, 'wifi');

    expect(on.filters.tag_keys).toEqual(['wifi']);
    expect(withTag(on, 'wifi').filters.tag_keys).toEqual([]);
  });
});

describe('withRadius', () => {
  it('clears the radius when the selected one is tapped again', () => {
    const on = withRadius(DEFAULT_QUERY, 1000);

    expect(on.filters.radius_m).toBe(1000);
    expect(withRadius(on, 1000).filters.radius_m).toBeUndefined();
  });
});

describe('withLocation', () => {
  it('replaces every level, so a street cannot outlive its ward', () => {
    const deep = withLocation(DEFAULT_QUERY, { area_id: 'a', ward_id: 'w', street_id: 's' });
    const next = withLocation(deep, { area_id: 'b' });

    expect(next.area_id).toBe('b');
    expect(next.ward_id).toBeUndefined();
    expect(next.street_id).toBeUndefined();
  });
});

describe('clearFilters', () => {
  it('resets filters but keeps location and sort', () => {
    const query = withFilters(
      { ...DEFAULT_QUERY, area_id: 'q1', sort: 'rating' },
      { open_now: true },
    );
    const next = clearFilters(query);

    expect(next.filters).toEqual(DEFAULT_FILTERS);
    expect(next.area_id).toBe('q1');
    expect(next.sort).toBe('rating');
  });
});

describe('countActiveFilters', () => {
  it('counts each selected value and each set flag', () => {
    const filters = {
      ...DEFAULT_FILTERS,
      tag_keys: ['wifi', 'work'],
      open_now: true,
      radius_m: 1000 as const,
    };

    expect(countActiveFilters(filters)).toBe(4);
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
  });
});
