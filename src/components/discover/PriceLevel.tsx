import { useTranslation } from 'react-i18next';
import type { PriceLevel as Level } from '@/types/place';

type Props = {
  level: Level;
};

export default function PriceLevel({ level }: Props) {
  const { t } = useTranslation();

  return (
    <span className="text-sm font-semibold" aria-label={t('place.priceLevelLabel', { level })}>
      <span aria-hidden="true" className="text-ink">
        {'₫'.repeat(level)}
      </span>
      <span aria-hidden="true" className="text-ink-3">
        {'₫'.repeat(3 - level)}
      </span>
    </span>
  );
}
