import { useTranslation } from 'react-i18next';

import BottomSheet from '@/components/BottomSheet';
import { CheckIcon } from '@/lib/icons';
import { SORT_KEYS, SORT_LABEL_KEYS, withSort } from '@/lib/search';
import { useSearch } from '@/store/search-store';
import { cn } from 'cn';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SortSheet({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const { query, update } = useSearch();

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={t('sort.title')}>
      <ul className="py-1">
        {SORT_KEYS.map((key) => {
          const active = query.sort === key;

          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => {
                  update((current) => {
                    return withSort(current, key);
                  });
                  // Choosing a sort closes the sheet — there is nothing else to confirm.
                  onOpenChange(false);
                }}
                className={cn(
                  'flex h-[52px] w-full items-center justify-between px-4 text-sm',
                  active ? 'bg-tint font-semibold text-tint-ink' : 'text-ink',
                )}
              >
                {t(SORT_LABEL_KEYS[key])}
                {active && <CheckIcon aria-hidden="true" className="size-5" />}
              </button>
            </li>
          );
        })}
      </ul>
    </BottomSheet>
  );
}
