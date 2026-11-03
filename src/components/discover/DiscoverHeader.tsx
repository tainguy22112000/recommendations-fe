import { useTranslation } from 'react-i18next';

import { setLocale } from '@/i18n';
import { useLocale } from '@/hooks/useLocale';
import { ChevronDownIcon, PinIcon, SearchIcon } from '@/lib/icons';
import { withCategory, withSearchTerm } from '@/lib/search';
import { useSearch } from '@/store/search-store';
import { cn } from 'cn';
import type { Category } from '@/types/place';

const CATEGORIES: { value: 'all' | Category; labelKey: string }[] = [
  { value: 'all', labelKey: 'discover.categoryAll' },
  { value: 'food', labelKey: 'discover.categoryFood' },
  { value: 'cafe', labelKey: 'discover.categoryCafe' },
];

interface Props {
  onOpenLocation: () => void;
  /** Collapsed on scroll: the location and search rows hide, the toolbar stays. */
  collapsed: boolean;
}

export default function DiscoverHeader({ onOpenLocation, collapsed }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const { query, update, locationLabel } = useSearch();

  return (
    <div className="bg-background px-4">
      <div
        className={cn(
          'grid overflow-hidden transition-[grid-template-rows,opacity] duration-200',
          collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
        )}
        // Collapsing uses a grid-rows transition rather than unmounting: unmounting the
        // search input would drop focus and dismiss the keyboard mid-typing.
        aria-hidden={collapsed}
      >
        <div className="min-h-0">
          <div className="flex items-center gap-2 pt-2 pb-3">
            <button
              type="button"
              onClick={onOpenLocation}
              aria-label={t('a11y.openLocation')}
              className="flex h-11 min-w-0 flex-1 items-center gap-1.5 rounded-chip border border-line bg-surface px-3"
            >
              <PinIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />
              <span className="truncate text-sm font-semibold">{locationLabel}</span>
              <ChevronDownIcon aria-hidden="true" className="size-4 shrink-0 text-ink-2" />
            </button>

            <div className="flex h-11 shrink-0 items-center rounded-chip bg-surface-2 p-1">
              {(['vi', 'en'] as const).map((value) => {
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={locale === value}
                    onClick={() => {
                      setLocale(value);
                    }}
                    className={cn(
                      'h-9 rounded-chip px-3 text-sm font-bold uppercase',
                      locale === value ? 'bg-ink text-background' : 'text-ink-2',
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="relative mb-3 block">
            <span className="sr-only">{t('discover.searchPlaceholder')}</span>
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-ink-2"
            />
            <input
              type="search"
              value={query.q ?? ''}
              onChange={(event) => {
                update((current) => {
                  return withSearchTerm(current, event.target.value);
                });
              }}
              placeholder={t('discover.searchPlaceholder')}
              className="h-[46px] w-full rounded-[14px] bg-surface-2 pr-3 pl-10 placeholder:text-ink-2"
            />
          </label>
        </div>
      </div>

      <div role="tablist" className="mb-3 flex h-11 items-center rounded-chip bg-surface-2 p-1">
        {CATEGORIES.map(({ value, labelKey }) => {
          const active = query.category === value;

          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                update((current) => {
                  return withCategory(current, value);
                });
              }}
              className={cn(
                'h-9 flex-1 rounded-chip text-sm font-semibold',
                active ? 'bg-surface text-ink shadow-segment' : 'text-ink-2',
              )}
            >
              {t(labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
