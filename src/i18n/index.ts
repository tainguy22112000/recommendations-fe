import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { Locale } from '@/lib/format';
import en from './en.json';
import vi from './vi.json';

// vi.json is the source of truth for the key namespace; en.json is checked against it below.
//
// Notes that cannot live in JSON:
// - Keys are provisional. `src/docs/02-component-breakdown.md` is meant to own the canonical
//   copy and does not exist yet — reconcile when it lands.
// - `cuisineHint` is empty in vi on purpose: EN appends a gloss after a '·', while the
//   Vietnamese dish name is never translated.
// - `count.*` keys are plural-resolved. Vietnamese has one plural category, so _one and
//   _other carry the same string; English needs the distinction.
// - `apiError` / `loginError` are keyed by the numeric API code. CLAUDE.md §"Error codes"
//   maps each number to its constant name — a translator needs that to know what 40101 is.

// Widens vi's value types while keeping its shape, so every key present in vi must exist in
// en. A missing translation fails `pnpm typecheck`. (An *extra* key in en is not caught:
// excess-property checking only applies to fresh object literals, not imported modules.)
type Translations<T> = {
  [K in keyof T]: T[K] extends string ? string : Translations<T[K]>;
};

const enChecked: Translations<typeof vi> = en;

const STORAGE_KEY = 'locale';

function storedLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'vi') {
    return stored;
  }

  return 'vi';
}

void i18next.use(initReactI18next).init({
  resources: { vi: { translation: vi }, en: { translation: enChecked } },
  lng: storedLocale(),
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
});

// <html lang> drives screen-reader pronunciation and hyphenation, so it has to follow the
// active locale rather than staying at the value index.html shipped with.
function syncDocumentLang(locale: Locale): void {
  document.documentElement.lang = locale;
}

syncDocumentLang(storedLocale());

// Language is a display preference, not auth state, so persisting it is fine.
export function setLocale(locale: Locale): void {
  localStorage.setItem(STORAGE_KEY, locale);
  syncDocumentLang(locale);
  void i18next.changeLanguage(locale);
}

export { i18next };
