import type { ReactNode } from 'react';

import { cn } from 'cn';

interface Props {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export default function SheetChip({ active, onClick, children }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex h-11 items-center gap-1.5 rounded-chip border px-3.5 text-sm font-medium',
        active ? 'border-primary bg-tint text-tint-ink' : 'border-line bg-surface text-ink',
      )}
    >
      {children}
    </button>
  );
}
