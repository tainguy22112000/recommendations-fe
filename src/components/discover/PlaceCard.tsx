import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useLocale } from '@/hooks/useLocale';
import { formatDecimal, formatDistance, formatVnd } from '@/lib/format';
import { HeartIcon, StarIcon } from '@/lib/icons';
import { cn } from 'cn';
import type { Place } from '@/types/place';
import PlaceStatus from './PlaceStatus';
import PriceLevel from './PriceLevel';

interface Props {
  place: Place;
  onToggleSave: (id: string) => void;
}

export default function PlaceCard({ place, onToggleSave }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();

  return (
    // The card is one button and the heart is a SIBLING stacked above it. Nesting a button
    // inside a button is invalid HTML and breaks keyboard and screen-reader behaviour.
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          void navigate(`/place/${place.id}`);
        }}
        className="block w-full text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <div className="relative h-[156px] w-full overflow-hidden rounded-card bg-surface-2">
          {place.cover_photo_url !== undefined && (
            <img
              src={place.cover_photo_url}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="rounded-chip bg-surface/95 px-2.5 py-1 text-xs font-semibold text-ink">
              {place.category === 'food' ? t('place.food') : t('place.cafe')}
            </span>
            {place.status === 'pending' && (
              <span className="rounded-chip bg-tint px-2.5 py-1 text-xs font-semibold text-tint-ink">
                {t('place.pending')}
              </span>
            )}
          </div>

          {place.cover_caption !== undefined && (
            <p className="absolute bottom-2 left-3 line-clamp-1 pr-24 text-xs font-medium text-white drop-shadow">
              {place.cover_caption}
            </p>
          )}
        </div>

        <div className="mt-2.5 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[17px] leading-tight font-bold">{place.name}</h3>
            <PriceLevel level={place.price_level} />
          </div>

          <p className="flex items-center gap-1.5 text-sm text-ink-2">
            {place.rating === null ? (
              <span>{t('place.noRating')}</span>
            ) : (
              <>
                <StarIcon aria-hidden="true" className="size-4 fill-star text-star" />
                <span className="font-semibold text-ink">
                  {formatDecimal(place.rating, locale)}
                </span>
                <span>{t('count.reviews', { count: place.review_count })}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{formatDistance(place.distance_m, locale)}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">
              {t('place.perPerson', { price: formatVnd(place.avg_price_per_person, locale) })}
            </span>
          </p>

          <p className="truncate text-sm text-ink-2">{place.street}</p>
          <PlaceStatus place={place} />
        </div>
      </button>

      <button
        type="button"
        aria-label={place.is_saved ? t('a11y.unsave') : t('a11y.save')}
        aria-pressed={place.is_saved}
        onClick={() => {
          onToggleSave(place.id);
        }}
        className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-surface/95 shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <HeartIcon
          aria-hidden="true"
          className={cn('size-5', place.is_saved ? 'fill-primary text-primary' : 'text-ink')}
        />
      </button>
    </div>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-2.5">
      <div className="h-[156px] w-full rounded-card bg-skel" />
      <div className="h-4 w-2/3 rounded bg-skel" />
      <div className="h-3.5 w-1/2 rounded bg-skel" />
      <div className="h-3.5 w-1/3 rounded bg-skel" />
    </div>
  );
}
