import { useTranslation } from 'react-i18next';
import { CardsIcon, MapIcon, TableIcon } from '@/lib/icons';
import { useSearch } from '@/store/search-store';

interface Props {
  /** Null when the backend declines to count; undefined while the first page loads. */
  total: number | null | undefined;
}

export default function ResultCountBar({ total }: Props) {
  const { t } = useTranslation();
  const { locationLabel } = useSearch();

  return (
    <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-1">
      <p aria-live="polite" className="truncate text-sm font-medium text-ink-2">
        {total === undefined || total === null
          ? t('common.loading')
          : t('count.results', { count: total, area: locationLabel })}
      </p>

      <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
        <span className="grid size-11 place-items-center rounded-[12px] bg-tint text-tint-ink">
          <CardsIcon className="size-5" />
        </span>
        <span
          className="grid size-11 place-items-center rounded-[12px] text-ink-3"
          title={t('nav.comingSoon')}
        >
          <TableIcon className="size-5" />
        </span>
        <span
          className="grid size-11 place-items-center rounded-[12px] text-ink-3"
          title={t('nav.comingSoon')}
        >
          <MapIcon className="size-5" />
        </span>
      </div>
    </div>
  );
}
