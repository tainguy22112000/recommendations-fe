import type { ReactNode } from 'react';

import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { CloseIcon } from '@/lib/icons';
import { useTranslation } from 'react-i18next';
import { cn } from 'cn';

interface Props {
  open: boolean;
  title: string;
  /** Rendered next to the title — the filter sheet's "N đang chọn", for example. */
  titleAside?: ReactNode;
  footer?: ReactNode;
  /** The design gives each sheet a fixed height; default is content height. */
  heightClassName?: string;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
}

// Every panel in the app is one of these: drag handle, scrim that closes on tap, trapped
// focus, scroll-locked body. vaul supplies the drag, dismiss and scroll lock; the ARIA
// comes from the underlying dialog.
export default function BottomSheet({
  open,
  title,
  titleAside,
  footer,
  heightClassName,
  children,
  onOpenChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs>
      <DrawerContent
        className={cn('mx-auto max-w-[480px] md:max-w-[480px]', heightClassName)}
        aria-modal="true"
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <DrawerTitle className="flex-1 truncate text-base font-bold">{title}</DrawerTitle>
          {titleAside}
          <button
            type="button"
            aria-label={t('common.close')}
            onClick={() => {
              onOpenChange(false);
            }}
            className="-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ink"
          >
            <CloseIcon aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer !== undefined && (
          <div className="border-t border-line bg-surface px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
