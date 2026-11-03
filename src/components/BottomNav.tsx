import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { BookmarkIcon, CompassIcon, MapIcon, UserIcon } from '@/lib/icons';
import { cn } from 'cn';

interface NavItem {
  to: string;
  labelKey: string;
  Icon: typeof CompassIcon;
  enabled: boolean;
}

const ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.discover', Icon: CompassIcon, enabled: true },
  { to: '/map', labelKey: 'nav.map', Icon: MapIcon, enabled: true },
  { to: '/saved', labelKey: 'nav.saved', Icon: BookmarkIcon, enabled: true },
  { to: '/account', labelKey: 'nav.account', Icon: UserIcon, enabled: true },
];

export default function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex w-full max-w-[480px] items-stretch">
        {ITEMS.map(({ to, labelKey, Icon, enabled }) => {
          return (
            <li key={to} className="flex-1">
              {enabled ? (
                <NavLink
                  to={to}
                  className={({ isActive }) => {
                    return cn(
                      'flex h-14 min-h-11 flex-col items-center justify-center gap-0.5',
                      isActive ? 'font-bold text-primary' : 'font-medium text-ink-2',
                    );
                  }}
                >
                  <Icon aria-hidden="true" className="size-6" />
                  <span className="text-[11px] leading-none">{t(labelKey)}</span>
                </NavLink>
              ) : (
                <span
                  aria-disabled="true"
                  title={t('nav.comingSoon')}
                  className="flex h-14 min-h-11 cursor-not-allowed flex-col items-center justify-center gap-0.5 font-medium text-ink-3"
                >
                  <Icon aria-hidden="true" className="size-6" />
                  <span className="text-[11px] leading-none">{t(labelKey)}</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
