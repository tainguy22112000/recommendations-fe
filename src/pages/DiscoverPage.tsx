import { useEffect, useState } from 'react';

import ActiveFilterRow from '@/components/discover/ActiveFilterRow';
import DiscoverHeader from '@/components/discover/DiscoverHeader';
import DiscoverToolbar from '@/components/discover/DiscoverToolbar';
import PlaceResults from '@/components/discover/PlaceResults';
import FilterSheet from '@/components/sheets/FilterSheet';
import LocationSheet from '@/components/sheets/LocationSheet';
import SortSheet from '@/components/sheets/SortSheet';
import { clearFilters, withFilters, withLocation } from '@/lib/search';
import { useSearchStore } from '@/store/search-store';

type Sheet = 'filter' | 'sort' | 'location' | null;

export default function DiscoverPage() {
  const update = useSearchStore((state) => {
    return state.update;
  });
  const [sheet, setSheet] = useState<Sheet>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    function onScroll(): void {
      setCollapsed(window.scrollY > 24);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  function toggleSave(id: string): void {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  return (
    <>
      <DiscoverHeader
        collapsed={collapsed}
        onOpenLocation={() => {
          setSheet('location');
        }}
      />

      <DiscoverToolbar
        onOpenFilters={() => {
          setSheet('filter');
        }}
        onOpenSort={() => {
          setSheet('sort');
        }}
      />

      <ActiveFilterRow />

      <PlaceResults
        savedIds={savedIds}
        onToggleSave={toggleSave}
        onExpandRadius={() => {
          update((current) => {
            return withFilters(current, { radius_m: 3000 });
          });
        }}
        onClearAll={() => {
          update(clearFilters);
        }}
      />

      <FilterSheet
        open={sheet === 'filter'}
        onOpenChange={(open) => {
          setSheet(open ? 'filter' : null);
        }}
      />
      <SortSheet
        open={sheet === 'sort'}
        onOpenChange={(open) => {
          setSheet(open ? 'sort' : null);
        }}
      />
      <LocationSheet
        open={sheet === 'location'}
        onOpenChange={(open) => {
          setSheet(open ? 'location' : null);
        }}
        onApply={(selection) => {
          update((current) => {
            return withLocation(current, selection);
          });
        }}
      />
    </>
  );
}
