import { useTranslation } from 'react-i18next';
import { CheckIcon, ChevronDownIcon, SlidersIcon } from '@/lib/icons';
import { countActiveFilters, QUICK_FILTERS, SORT_LABEL_KEYS } from '@/lib/search';
import { useSearch } from '@/store/search-store';
import { cn } from 'cn';

interface Props {
  onOpenFilters: () => void;
  onOpenSort: () => void;
}

export default function DiscoverToolbar({ onOpenFilters, onOpenSort }: Props) {
  const { t } = useTranslation();
  const { query, update } = useSearch();

  const activeCount = countActiveFilters(query.filters);
  const sortIsDefault = query.sort === 'relevant';

  return (
    <div className="sticky top-0 z-20 border-y border-line bg-surface">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <button
          type="button"
          onClick={onOpenFilters}
          aria-label={t('a11y.openFilters')}
          className={cn(
            'flex h-11 shrink-0 items-center gap-1.5 rounded-[14px] border px-3 text-sm font-semibold',
            activeCount > 0 ? 'border-primary bg-tint text-tint-ink' : 'border-line text-ink',
          )}
        >
          <SlidersIcon aria-hidden="true" className="size-5" />
          {t('discover.filters')}
          {activeCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSort}
          aria-label={t('a11y.openSort')}
          className={cn(
            'flex h-11 min-w-0 flex-1 items-center justify-between gap-1.5 rounded-[14px] border px-3 text-sm',
            sortIsDefault ? 'border-line' : 'border-primary',
          )}
        >
          <span className="truncate">
            <span className="text-ink-2">{t('discover.sortPrefix')} </span>
            <span className="font-semibold">{t(SORT_LABEL_KEYS[query.sort])}</span>
          </span>
          <ChevronDownIcon aria-hidden="true" className="size-4 shrink-0 text-ink-2" />
        </button>
      </div>

      <ul className="flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-2.5 [&::-webkit-scrollbar]:hidden">
        {QUICK_FILTERS.map((filter) => {
          const active = filter.isActive(query);

          return (
            <li key={filter.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  update(filter.toggle);
                }}
                className={cn(
                  'flex h-11 items-center gap-1.5 rounded-chip border px-3.5 text-sm font-medium whitespace-nowrap',
                  active
                    ? 'border-primary bg-tint text-tint-ink'
                    : 'border-line bg-surface text-ink',
                )}
              >
                {active && <CheckIcon aria-hidden="true" className="size-4" />}
                {t(filter.labelKey)}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
