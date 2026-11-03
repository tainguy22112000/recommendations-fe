import { useTranslation } from 'react-i18next';

import { EmptyState, ErrorState, LoadingState } from '@/components/ListStates';
import type { CursorPaginationProps } from '@/components/withCursorPagination';
import { withCursorPagination } from '@/components/withCursorPagination';
import { usePlaces } from '@/hooks/usePlaces';
import { useSearch } from '@/store/search-store';
import type { Place } from '@/types/place';
import PlaceCard, { PlaceCardSkeleton } from './PlaceCard';
import ResultCountBar from './ResultCountBar';

interface OwnProps {
  savedIds: Set<string>;
  onToggleSave: (id: string) => void;
  onExpandRadius: () => void;
  onClearAll: () => void;
}

function PlaceResultsView({
  savedIds,
  items,
  total,
  isPending,
  isError,
  isFetchingMore,
  hasMore,
  onToggleSave,
  onExpandRadius,
  onClearAll,
  sentinelRef,
  retry,
}: OwnProps & CursorPaginationProps<Place>) {
  const { t } = useTranslation();

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={retry} />;
  }

  if (items.length === 0) {
    return <EmptyState onExpandRadius={onExpandRadius} onClearAll={onClearAll} />;
  }

  return (
    <>
      <ResultCountBar total={total} />

      {/* 96px of bottom padding reserves room for the R3 lucky-spin FAB. */}
      <ul className="flex flex-col gap-[22px] px-4 pt-3 pb-24">
        {items.map((place) => {
          return (
            <li key={place.id}>
              <PlaceCard
                place={{ ...place, is_saved: savedIds.has(place.id) || place.is_saved }}
                onToggleSave={onToggleSave}
              />
            </li>
          );
        })}

        <li ref={sentinelRef} aria-hidden="true" className="h-1" />

        {isFetchingMore && (
          <li>
            <PlaceCardSkeleton />
            <p className="pt-3 text-center text-sm text-ink-2">{t('discover.loadingMore')}</p>
          </li>
        )}

        {!hasMore && (
          <li className="pb-2 text-center text-sm text-ink-2">{t('discover.endOfList')}</li>
        )}
      </ul>
    </>
  );
}

const PlaceResults = withCursorPagination<Place, OwnProps>(() => {
  const { query } = useSearch();

  return usePlaces(query);
})(PlaceResultsView);

export default PlaceResults;
