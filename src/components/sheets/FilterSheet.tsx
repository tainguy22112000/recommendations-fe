import { useTranslation } from 'react-i18next';

import BottomSheet from '@/components/BottomSheet';
import SheetChip from '@/components/SheetChip';
import { usePlaceCount } from '@/hooks/usePlaces';
import { CheckIcon } from '@/lib/icons';
import {
  AMENITY_KEYS,
  CUISINE_KEYS,
  MIN_RATING_OPTIONS,
  PRICE_LEVELS,
  RADIUS_OPTIONS,
  VIBE_KEYS,
  clearFilters,
  countActiveFilters,
  withCuisine,
  withFilters,
  withMinRating,
  withPriceLevel,
  withRadius,
  withTag,
} from '@/lib/search';
import { useLocale } from '@/hooks/useLocale';
import { formatDecimal, formatDistance } from '@/lib/format';
import { useSearch } from '@/store/search-store';
import { cn } from 'cn';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Section({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line px-4 py-4 last:border-b-0">
      <legend className="mb-3 text-sm font-bold">{legend}</legend>
      {children}
    </fieldset>
  );
}

export default function FilterSheet({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const { query, update, originLabel } = useSearch();

  // Filters apply live, as the design does, so the count query and the list query are the
  // same object — the count is just a second query with a debounce, not a second state tree.
  const count = usePlaceCount(query, open);
  const activeCount = countActiveFilters(query.filters);
  const showsCuisine = query.category !== 'cafe';
  const showsVibe = query.category !== 'food';

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t('filter.title')}
      heightClassName="h-[90dvh] max-h-[90dvh]"
      titleAside={
        activeCount > 0 ? (
          <span className="shrink-0 text-sm font-semibold text-primary">
            {t('count.selected', { count: activeCount })}
          </span>
        ) : undefined
      }
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              update(clearFilters);
            }}
            className="h-12 shrink-0 rounded-[14px] border border-line px-4 text-sm font-semibold"
          >
            {t('empty.clearAll')}
          </button>
          <button
            type="button"
            disabled={count.data === 0}
            onClick={() => {
              onOpenChange(false);
            }}
            className="h-12 flex-1 rounded-[14px] bg-primary text-sm font-bold text-primary-foreground disabled:bg-surface-2 disabled:text-ink-3"
          >
            {count.data === undefined
              ? t('common.loading')
              : count.data === 0
                ? t('filter.noResults')
                : t('count.showResults', { count: count.data })}
          </button>
        </div>
      }
    >
      <Section legend={t('filter.price')}>
        <div className="grid grid-cols-3 gap-2">
          {PRICE_LEVELS.map((level) => {
            const active = query.filters.price_levels.includes(level);

            return (
              <button
                key={level}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  update((current) => {
                    return withPriceLevel(current, level);
                  });
                }}
                className={cn(
                  'flex h-16 flex-col items-center justify-center gap-0.5 rounded-[14px] border text-sm',
                  active ? 'border-primary bg-tint text-tint-ink' : 'border-line',
                )}
              >
                <span className="font-bold">{'₫'.repeat(level)}</span>
                <span className="text-xs">{t(`filter.priceHint${level}`)}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {showsCuisine && (
        <Section legend={t('filter.cuisine')}>
          <div className="flex flex-wrap gap-2">
            {CUISINE_KEYS.map((key) => {
              const hint = t(`cuisineHint.${key}`);

              return (
                <SheetChip
                  key={key}
                  active={query.filters.cuisines.includes(key)}
                  onClick={() => {
                    update((current) => {
                      return withCuisine(current, key);
                    });
                  }}
                >
                  {/* Dish names stay Vietnamese; EN appends a gloss. */}
                  {t(`cuisine.${key}`)}
                  {hint !== '' && <span className="text-xs text-ink-2">· {hint}</span>}
                </SheetChip>
              );
            })}
          </div>
        </Section>
      )}

      {showsVibe && (
        <Section legend={t('filter.vibe')}>
          <div className="flex flex-wrap gap-2">
            {VIBE_KEYS.map((key) => {
              return (
                <SheetChip
                  key={key}
                  active={query.filters.tag_keys.includes(key)}
                  onClick={() => {
                    update((current) => {
                      return withTag(current, key);
                    });
                  }}
                >
                  {t(`tag.${key}`)}
                </SheetChip>
              );
            })}
          </div>
        </Section>
      )}

      <Section legend={t('filter.hours')}>
        <div className="flex flex-wrap gap-2">
          <SheetChip
            active={query.filters.open_now}
            onClick={() => {
              update((current) => {
                return withFilters(current, { open_now: !current.filters.open_now });
              });
            }}
          >
            {t('filter.openNow')}
          </SheetChip>
          <SheetChip
            active={query.filters.open_late}
            onClick={() => {
              update((current) => {
                return withFilters(current, { open_late: !current.filters.open_late });
              });
            }}
          >
            {t('filter.openLate')}
          </SheetChip>
          <SheetChip
            active={query.filters.open_24h}
            onClick={() => {
              update((current) => {
                return withFilters(current, { open_24h: !current.filters.open_24h });
              });
            }}
          >
            {t('filter.open24h')}
          </SheetChip>
        </div>
      </Section>

      <Section
        legend={`${t('filter.distance')} · ${t('filter.distanceFrom', { street: originLabel })}`}
      >
        <div className="grid grid-cols-4 gap-2">
          {RADIUS_OPTIONS.map((radius) => {
            const active = query.filters.radius_m === radius;

            return (
              <button
                key={radius}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  // Tapping the selected radius clears it.
                  update((current) => {
                    return withRadius(current, radius);
                  });
                }}
                className={cn(
                  'h-11 rounded-[14px] border text-sm font-medium',
                  active ? 'border-primary bg-tint text-tint-ink' : 'border-line',
                )}
              >
                {formatDistance(radius, locale)}
              </button>
            );
          })}
        </div>
      </Section>

      <Section legend={t('filter.minRating')}>
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            aria-pressed={query.filters.min_rating === undefined}
            onClick={() => {
              update((current) => {
                return withFilters(current, { min_rating: undefined });
              });
            }}
            className={cn(
              'h-11 rounded-[14px] border text-sm font-medium',
              query.filters.min_rating === undefined
                ? 'border-primary bg-tint text-tint-ink'
                : 'border-line',
            )}
          >
            {t('filter.ratingAny')}
          </button>
          {MIN_RATING_OPTIONS.map((rating) => {
            const active = query.filters.min_rating === rating;

            return (
              <button
                key={rating}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  update((current) => {
                    return withMinRating(current, rating);
                  });
                }}
                className={cn(
                  'h-11 rounded-[14px] border text-sm font-medium',
                  active ? 'border-primary bg-tint text-tint-ink' : 'border-line',
                )}
              >
                {formatDecimal(rating, locale)}+
              </button>
            );
          })}
        </div>
      </Section>

      <Section legend={t('filter.amenities')}>
        <ul>
          {AMENITY_KEYS.map((key) => {
            const active = query.filters.tag_keys.includes(key);

            return (
              <li key={key}>
                <label className="flex h-11 cursor-pointer items-center justify-between gap-3 text-sm">
                  <span>{t(`tag.${key}`)}</span>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => {
                      update((current) => {
                        return withTag(current, key);
                      });
                    }}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-md border',
                      active ? 'border-primary bg-primary text-primary-foreground' : 'border-line',
                    )}
                  >
                    {active && <CheckIcon className="size-4" />}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </Section>
    </BottomSheet>
  );
}
