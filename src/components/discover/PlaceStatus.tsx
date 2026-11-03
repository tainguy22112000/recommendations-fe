import { useTranslation } from 'react-i18next';

import { useLocale } from '@/hooks/useLocale';
import { formatTime } from '@/lib/format';
import { cn } from 'cn';
import type { Place } from '@/types/place';

interface Props {
  place: Pick<Place, 'is_open' | 'is_24h' | 'closes_at' | 'opens_at'>;
  className?: string;
}

export default function PlaceStatus({ place, className }: Props) {
  const { t } = useTranslation();
  const locale = useLocale();

  const detail = place.is_24h
    ? t('place.open24h')
    : place.is_open
      ? place.closes_at !== undefined &&
        t('place.until', { time: formatTime(place.closes_at, locale) })
      : place.opens_at !== undefined &&
        t('place.opensAt', { time: formatTime(place.opens_at, locale) });

  return (
    <p
      className={cn(
        'flex items-center gap-1.5 text-sm',
        place.is_open ? 'text-open' : 'text-ink-2',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-2 shrink-0 rounded-full', place.is_open ? 'bg-open' : 'bg-ink-3')}
      />
      <span className="truncate">
        {place.is_open ? t('place.open') : t('place.closed')}
        {detail ? ` · ${detail}` : ''}
      </span>
    </p>
  );
}
