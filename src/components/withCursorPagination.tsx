import type { ComponentType } from 'react';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

import { useScrollSentinel } from '@/hooks/useScrollSentinel';
import type { CursorResponse } from '@/types/api';

/** Injected into the wrapped component. */
export interface CursorPaginationProps<T> {
  /** Every page flattened into one list, in order. */
  items: T[];
  total: number | null | undefined;
  isPending: boolean;
  isError: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  /** Attach to the element at the end of the list. */
  sentinelRef: (node: HTMLElement | null) => void;
  retry: () => void;
}

type PaginatedQuery<T> = UseInfiniteQueryResult<InfiniteData<CursorResponse<T>>>;

/**
 * Gives a list component cursor-based scroll-to-fetch.
 *
 * Takes the infinite-query hook rather than a fetcher so the caller keeps control of the
 * cache key, and so the hook can read other state (the search store, route params) itself.
 *
 *   const Results = withCursorPagination<Place, OwnProps>(
 *     () => usePlaces(useSearch().query),
 *   )(ResultsView);
 */
export function withCursorPagination<T, OwnProps extends object>(
  usePaginatedQuery: (props: OwnProps) => PaginatedQuery<T>,
  options: { rootMargin?: string } = {},
) {
  return function wrap(Wrapped: ComponentType<OwnProps & CursorPaginationProps<T>>) {
    function WithCursorPagination(props: OwnProps) {
      const query = usePaginatedQuery(props);

      const hasMore = query.hasNextPage;
      // Gating on isFetchingNextPage is what stops a burst of duplicate requests while the
      // sentinel sits in view during a fetch.
      const sentinelRef = useScrollSentinel({
        enabled: hasMore && !query.isFetchingNextPage,
        rootMargin: options.rootMargin,
        onReachEnd: () => {
          void query.fetchNextPage();
        },
      });

      const pages = query.data?.pages ?? [];

      return (
        <Wrapped
          {...props}
          items={pages.flatMap((page) => {
            return page.items;
          })}
          total={pages[0]?.total}
          isPending={query.isPending}
          isError={query.isError}
          isFetchingMore={query.isFetchingNextPage}
          hasMore={hasMore}
          sentinelRef={sentinelRef}
          retry={() => {
            void query.refetch();
          }}
        />
      );
    }

    WithCursorPagination.displayName = `withCursorPagination(${
      Wrapped.displayName ?? Wrapped.name ?? 'Component'
    })`;

    return WithCursorPagination;
  };
}
