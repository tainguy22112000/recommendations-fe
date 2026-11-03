# Frontend Context — Saigon Food & Coffee Finder

> **Product scope, screens, design tokens and release order** come from `src/docs/` and
> `README.md`; those are the source of truth for _what_ to build.
> **Library choices** come from `package.json`; it is the source of truth for _what with_.
> Where the two disagree, see §"Stack reconciliation" — the docs' `[STACK]` block explicitly
> permits substitution, so the installed stack wins and the docs' intent is preserved.

## Role

A mobile-first React SPA for discovering restaurants (quán ăn) and cafés (cà phê) in Ho Chi
Minh City. Bilingual VI (default) / EN, light + dark, installable as a PWA.

The core job: **help someone find a place to eat or drink right now.** Every scope decision
is settled by asking whether it serves that sentence.

Target viewport 390×844, must work 360–430px. **Phone only until R3** — but the root is
fluid (`max-width: 480px`, centred on larger screens), never a hard-coded 390px.

Previously this frontend was auth-only. That work is done and still stands (cookie session,
CSRF, `/login`), but it is now **supporting infrastructure** for Saved and Add-a-place, not
the product. See §"Auth" below.

## Source docs

| File                                    | Use it for                                                |
| --------------------------------------- | --------------------------------------------------------- |
| `README.md`                             | Screen inventory (21 artboards), build order summary      |
| `src/docs/01-implementation-prompt.md`  | Phase-by-phase build plan, design tokens, data contracts  |
| `src/docs/04-mobile-screen-priority.md` | Screen ranking, R1/R2/R3 slices, phone rules, sprint plan |

⚠️ **Two referenced docs do not exist on disk.** `README.md` indexes four files; only `01`
and `04` are present:

- `02-component-breakdown.md` — component tree, props, state ownership, **i18n keys**.
  Phase 1 says to take the VI/EN copy from it. Until it lands, i18n keys are invented at the
  call site and must be reconciled later.
- `03-database-analysis.md` — entities, schema, **the API contract**. The `IPlace` (`Place` in
  `src/types`) / `SearchQuery` types in `01` are the only contract we have. Everything beyond them
  is an assumption. Reverse-geocoding and the area, ward and street lists are still mocked.

Do not invent an API contract and present it as settled. Mock it, keep mocks in one place,
and mark the boundary.

## Stack reconciliation

The docs describe a greenfield stack; this repo already has a committed, working one. The
docs' `[STACK]` block says _"Replace the `[STACK]` block if you use a different stack"_, so
the installed library wins on every row below. The **design intent** of each doc row is kept.

| Concern   | Docs say                    | We use (installed)                 | How intent is preserved                                            |
| --------- | --------------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| React     | 18                          | **19.3**                           | No API in the docs needs 18                                        |
| UI        | no UI kit, CSS Modules      | **shadcn/ui (radix-nova) + TW 4**  | Retokenise the primitives to the palette below                     |
| App state | Zustand                     | **Zustand** (`store/search-store`) | Matches the docs; server state still lives in TanStack Query       |
| Theming   | `data-theme="dark"` on html | **next-themes** writing `.dark`    | Same tokens, different attribute; see §Theming                     |
| Font      | Be Vietnam Pro              | **Be Vietnam Pro** (`@fontsource`) | Matches the docs; static weights, subsets gated by `unicode-range` |
| Icons     | inline stroke SVG, 24px     | **lucide-react**                   | Lucide is 24px stroke; matches. **No emoji in UI** either way      |
| Map (R2)  | MapLibre GL / Google Maps   | not installed                      | Decide at R2; lazy-load as its own chunk                           |
| PWA (R2)  | `vite-plugin-pwa`           | not installed                      | Add at R2, not before                                              |
| i18n      | `i18next`, vi + en          | **i18next + react-i18next**        | Installed in phase 1; `en.json` is typed against `vi.json`         |

Unresolved and deliberately so: the **map SDK choice**. Cheap to defer; it does not block R1.

## Stack & libraries

- React 19 + Vite + TypeScript (strict), pinned to **6.0.x**: `typescript-eslint` requires `<6.1.0`.
  Move back to 7 once its peer range allows it
- `react-router-dom` v7 (data router: `createBrowserRouter` + `RouterProvider`)
- `@tanstack/react-query` — all **server** state
- `zustand` — the one piece of global **client** state (`SearchQuery`)
- `axios` (shared instance with the auth/CSRF interceptor)
- `tailwindcss` v4 (CSS-first; no `tailwind.config.ts`) + shadcn/ui (style `radix-nova`)
- `next-themes` (theme class), `sonner` (toasts), `vaul` (drawers → bottom sheets)
- `i18next` + `react-i18next` — VI default, EN peer; `i18n/en.json` is typed against `vi.json`
  so a missing translation is a compile error

## Commands

```bash
pnpm install
pnpm dev           # http://localhost:5173 (API on :9999)
pnpm build         # tsc -b (type gate) then vite build → dist/
pnpm typecheck
pnpm test          # vitest (format/normalize helpers must be covered)
pnpm lint          # eslint, zero warnings allowed
pnpm lint:fix
pnpm format        # prettier + Tailwind class sorting
pnpm format:check
```

## Routes

Sheets are **overlay state, not routes** (optionally mirrored to `?sheet=`). Only these are
real routes:

| Path          | Screen         | Release | Notes                                 |
| ------------- | -------------- | ------- | ------------------------------------- |
| `/`           | Discover       | R1      | Card list; also hosts table/map views |
| `/place/:id`  | Place detail   | R1      | No bottom nav                         |
| `/saved`      | Saved          | R2      | Needs a session or device id          |
| `/account`    | Account        | R2      | Language, theme, default location     |
| `/add`        | Add a place    | R2      | No bottom nav; 3 steps at ≤360px      |
| `/login`      | LoginPage      | done    | Outside the auth gate                 |
| `/onboarding` | OnboardingPage | done    | After a sign-up                       |
| `*`           | NotFoundPage   | done    |                                       |

In R1 the bottom nav shows Discover active; Map / Saved / Account are hidden or disabled with
"Sắp ra mắt / Coming soon".

**Browsing does not require sign-in.** `RequireAuth` must wrap only `/saved`, `/account` and
`/add` — never `/` or `/place/:id`. Gating Discover would break the core job.

## Design tokens

CSS variables on `:root`, redefined for dark. These are **the** palette — do not introduce
ad-hoc colours, and retokenise `components/ui/` rather than hard-coding hexes in components.

| Token                    | Light                 | Dark                  | Use                           |
| ------------------------ | --------------------- | --------------------- | ----------------------------- |
| `--bg`                   | `#FBF7F2`             | `#16110E`             | app background                |
| `--surface`              | `#FFFFFF`             | `#221A15`             | cards, sheets, nav            |
| `--surface-2`            | `#F3EBE3`             | `#2E241D`             | inputs, segmented tracks      |
| `--ink`                  | `#2B1D15`             | `#F4EAE2`             | primary text                  |
| `--ink-2`                | `#6A5446`             | `#C4B1A3`             | secondary text                |
| `--ink-3`                | `#CDBCAF`             | `#5E4D42`             | decorative (unused ₫, dashes) |
| `--line`                 | `#E8DDD3`             | `#3B2F27`             | borders, dividers             |
| `--primary`              | `#B4532F`             | `#E8906A`             | terracotta: buttons, active   |
| `--on-primary`           | `#FFFFFF`             | `#1B0F09`             | text on primary               |
| `--tint` / `--tint-ink`  | `#F7E4DA` / `#8C3C1E` | `#3C271D` / `#F6B898` | selected chips                |
| `--open` / `--open-tint` | `#1D7A4C` / `#E2F2E8` | `#66CC98` / `#173220` | "Đang mở / Open"              |
| `--star`                 | `#C27A12`             | `#F0B24A`             | star icon                     |
| `--scrim`                | `rgba(28,18,12,.48)`  | `rgba(0,0,0,.62)`     | sheet backdrop                |
| `--skel`                 | `#EDE3D9`             | `#2F261F`             | skeleton blocks               |

Radii: chips `999px`, inputs/buttons `12–14px`, cards `16px`, sheets `22px` (top only).
Shadows soft and warm: `0 6px 18px rgba(60,35,20,.08)`.
Spacing scale: `4 / 8 / 12 / 16 / 20 / 24`. Page side padding `16px`. Body text `15px/1.4`.

## Theming

The docs specify `data-theme="dark"` on `<html>`; `next-themes` is already wired to write the
`.dark` class that the generated `radix-nova` variant expects. **Keep `.dark`** — switching to
`data-theme` would mean re-generating every `components/ui/` file for no visual gain.

R1 ships light only. R2 adds the Account toggle (Sáng | Tối) — note this **changes** the old
auth-era rule of "follow `prefers-color-scheme`, no toggle": `defaultTheme="system"` stays the
default, but an explicit user choice must now persist and win.

## i18n — the rule that touches every component

**Every string goes through i18n. No hard-coded copy in components.** VI is the default
locale; EN is a full peer, not a fallback.

1. **Place names are never translated** — Nguyễn Huệ, Phường Xuân Hòa, Bình Thạnh. District
   _labels_ may translate ("Quận 3" ↔ "District 3").
2. **Dish names stay Vietnamese.** In EN mode append a hint: `Cơm tấm · broken rice`.
3. Locale formatting lives in `lib/format.ts`, never inline:

   | Helper                 | vi        | en         |
   | ---------------------- | --------- | ---------- |
   | `formatVnd(45000)`     | `45.000₫` | `45,000₫`  |
   | `formatDecimal(4.7)`   | `4,7`     | `4.7`      |
   | `formatDistance(1200)` | `1,2 km`  | `1.2 km`   |
   | `formatTime('22:30')`  | `22:30`   | `10:30 PM` |

   Each helper is unit-tested in both locales. This is the one place tests are mandatory.

4. `lib/normalize.ts` → `normalizeVi(s)`: lower-case, NFD-strip diacritics, `đ`→`d`. Used for
   search and duplicate checks. Test: `normalizeVi('Phường Võ Thị Sáu') === 'phuong vo thi sau'`.
5. **VI and EN string lengths differ a lot.** Everything truncates with an ellipsis or wraps;
   nothing overflows horizontally. Check both locales at 360px.

⚠️ This supersedes the auth-era rule "UI text is in English". Error copy lives in the i18n
resources, not in `lib/errors.ts`. The backend still replies in Vietnamese; always render
`messageFor(err)`, never `err.message`.

## Error codes

Codes are **numbers**, formatted `HTTP status x100 + sequence`. A number is a stable,
language-independent token, so the i18n key _is_ the code — there is no name-to-number
table to keep in sync, and adding a locale means adding copy, never touching the contract.

```ts
// types/api.ts — one numeric space, so a code is unambiguous wherever it appears
const ERROR_CODE = {
  // JSON body: { error: { code, message } }
  VALIDATION_ERROR: 40001,
  UNAUTHENTICATED: 40101,
  FORBIDDEN: 40301, // also a rejected CSRF token
  RATE_LIMITED: 42901,
  INTERNAL: 50001,
};

const LOGIN_ERROR = {
  // the callback redirect's ?error= param
  CANCELLED: 40102,
  LOGIN_FAILED: 40103,
  FORBIDDEN: 40302, // the Google account is not allowed
  SERVER_ERROR: 50002,
};
```

Copy lives under `apiError.<code>` and `loginError.<code>` in `i18n/{vi,en}.json`. JSON has no
comments, so this section is what maps a number to its constant — `40101` alone tells a translator
nothing. `en.json` is typed against `vi.json`, so a code with no translation fails `pnpm typecheck`.

Rules:

- **Never branch on a code's number in a component.** Compare against `ERROR_CODE.X`.
- `ERROR_CODE` and `LOGIN_ERROR` must not collide — one space, unique sequences.
- An unmodelled code degrades to `INTERNAL` rather than rendering a missing key. Adding a
  backend code without adding copy here is therefore silent; add both.
- API codes arrive as **JSON numbers**. A code sent as the string `"40101"` is rejected and
  degrades to `INTERNAL`.
- `?error=` is a URL param and always a string, so `parseLoginErrorCode` coerces it. It is
  untrusted input: anything non-numeric or unmodelled yields `null` and no banner renders.

⚠️ **Both sets need the Go backend to emit numbers.** Until it does, `/api` errors all show
the generic INTERNAL copy, and `?error=cancelled` renders no banner at all. Confirm the five
API values against the Go `ErrorCode` enum before relying on them — they were derived from
the documented HTTP status mapping, not read off the handlers.

## Mobile-web rules (apply from R1)

- Viewport `width=device-width, initial-scale=1, viewport-fit=cover`. Without
  `viewport-fit=cover`, `env(safe-area-inset-*)` resolves to `0px`.
- Full-height screens use `100dvh` / `min-h-dvh`, never `100vh`.
- `env(safe-area-inset-bottom)` padding on the bottom nav, sheet footers, sticky bars and the
  spin button. Plain `env()` is `0px` on a non-notched device, so use
  `max(1rem, env(safe-area-inset-bottom))`.
- **Every `<input>` / `<textarea>` is 16px**, even where the design shows 15px — iOS Safari
  zooms in below that.
- Keep focused inputs above the keyboard: `scrollIntoView({block:'center'})` plus the
  `visualViewport` resize event to lift sticky footers.
- Tap targets ≥ 44×44px with ≥ 8px between them. The Nova button primitive is 32–36px, so
  override with `size-11` / `h-11` rather than editing `components/ui/`.
- `touch-action: manipulation`. **No hover-only affordances** — hover styles only inside
  `@media (hover: hover)`.
- Primary actions sit in the **lower half** of the screen (sheet footers, sticky bars).
- Geolocation only after a user tap, never on load; HTTPS required; fall back to the manual
  location cascade.
- On scroll, the Discover header collapses (location + search rows hide) while the filter/sort
  toolbar stays sticky — cards should get ~70% of the screen.

### Bottom sheets

All panels (location, filters, sort, lucky spin) are bottom sheets, built on `vaul`:
drag handle, scrim that closes on tap, `role="dialog"`, `aria-modal="true"`, focus trapped
inside, `overscroll-behavior: contain`, body scroll locked while open, swipe down to close,
animations under 250ms. Confirmations use a sheet, never `window.confirm`.

## Accessibility

- Real `<button>`, `<input>`, `<label>`, `<a>` elements. Icon-only buttons need `aria-label`.
- Toggles use `aria-pressed`; tabs use `role="tab"` + `aria-selected`; the results table uses
  `role="table|row|columnheader|rowheader|cell"` + `aria-sort`.
- Text contrast ≥ 4.5:1 (WCAG AA) in **both** themes.
- Result counts are `aria-live="polite"`; the spin result is `role="status"`.
- Respect `prefers-reduced-motion` — the spin skips straight to its result.
- Tab order is logical; sheets trap focus; axe reports no serious violations.
- Never use `dangerouslySetInnerHTML`.

## Performance budget

**≤ 170 KB gzipped initial JS** (tightened from the auth-era 200 KB), LCP < 2.5s on a
mid-range Android over 4G. Measure, do not estimate:

```bash
pnpm build && gzip -c dist/assets/index-*.js | wc -c
```

Lazy-load the map SDK (R2) and the lucky spin (R3) as separate chunks. Images via `srcset` +
WebP/AVIF with blurhash placeholders.

⚠️ The current build is **208 KB gzipped** (measured 2026-11-03) — over the 170 KB budget. Trim before adding the map or spin chunks.

## Data contracts

**Wire format is `snake_case`, and the TypeScript types mirror it exactly.** There is no
transform layer: what the backend sends is what components read, so `place.avg_price_per_person`
is the field name everywhere. Keep it that way — adding a camelCase mapping for some
endpoints and not others is how two conventions end up in one codebase.

React props, local state, store internals and i18n keys stay **camelCase**; they never cross
the wire. Only fields that appear in a JSON payload are snake_case.

Mock these first; the real API is specified in the missing `03-database-analysis.md`.

```ts
type Category = 'food' | 'cafe';

interface Place {
  id: string;
  name: string;
  category: Category;
  rating: number | null;
  review_count: number;
  price_level: 1 | 2 | 3;
  avg_price_per_person: number; // VND
  distance_m: number;
  street: string;
  area_id: string;
  is_open: boolean;
  closes_at?: string;
  opens_at?: string;
  is_24h: boolean;
  cover_photo_url?: string;
  cover_caption?: string;
  tags: string[]; // tag keys, e.g. 'work','wifi','aircon'
  cuisine?: string | null; // 'pho','bun','comtam',...
  status: 'approved' | 'pending';
  is_saved: boolean;
  lat: number;
  lng: number;
}

interface SearchQuery {
  category: 'all' | Category;
  area_id?: string;
  ward_id?: string;
  street_id?: string;
  filters: {
    tag_keys: string[];
    price_levels: number[];
    cuisines: string[];
    openNow: boolean;
    openLate: boolean;
    open24h: boolean;
    radius_m?: 500 | 1000 | 3000 | 5000;
    min_rating?: 3.5 | 4 | 4.5;
  };
  sort:
    | 'relevant'
    | 'nearest'
    | 'rating'
    | 'price_asc'
    | 'price_desc'
    | 'newest'
    | 'name'
    | 'open_first';
}

// Cursor pagination, generic over the row type (types/api.ts).
interface CursorPage<T> {
  items: T[];
  next_cursor: string | null; // null is the only end-of-list signal
  total: number | null; // null when the backend declines to count
}

interface CursorParams {
  cursor?: string;
  limit?: number;
}

type PlaceCursorPage = CursorPage<Place>;
```

⚠️ `src/types` has drifted from this block: the code has `CursorResponse` with an optional
`next_cursor` and a required `limit` where this says `CursorPage`, and `open_now` / `open_late` /
`open_24h` where this says camelCase. `src/types` is what runs; reconcile when the API contract lands.

**The cursor is not part of `SearchQuery`.** The doc's contract lists it there, but it is
pagination state, not search state: folding it into the TanStack Query key would give every
page its own cache entry instead of appending pages to one list. `fetchPlaces(query, params)`
takes it separately, and `usePlaces` passes it as the `pageParam`.

Cursors are **opaque**. Never compute or compare one in the client — an offset would shift
when rows are inserted mid-scroll and the user would see duplicates or gaps.

Scroll-to-fetch is `withCursorPagination(useQueryHook)(ListView)`, which injects `items`,
`total`, `hasMore`, `isFetchingMore`, `sentinelRef` and `retry`. Attach `sentinelRef` to an
element at the end of the list; it is a callback ref, so it survives the list unmounting
between its loading, empty and error branches.

**One `SearchQuery` is the single source of truth for results.** Quick chips, active chips,
the filter sheet, the sort sheet and the table headers all read and write the _same_ state.
Any second copy drifts and the UI starts lying about what is filtered.

Endpoints the UI needs (shape unconfirmed): `GET /places`, `GET /places/count` (live filter
count, debounce 250ms), `GET /locations/search?q=`, `GET /places/duplicates?name=&lat=&lng=`
(debounce 300ms), `POST /place-submissions`, `POST /events`.

## Release slices

Build R1 first, and only the R1 parts of mixed phases.

**R1 — "Find a place near me" (MVP).** Flow: open → set location → browse cards →
filter/sort → open a place → get directions.
Discover cards, category tabs, quick + active chips; filter / sort / location sheets; detail
with media grid and "Chỉ đường"; loading, empty and end-of-list states; bottom nav; VI/EN
toggle; light theme.
_Hidden in R1:_ lucky spin, "Thêm quán mới" CTA, the table and map view toggles.

**R2 — "Come back and contribute."** Saved, Account, dark theme; map view; media viewer;
add-a-place with moderation; PWA install + offline cache.

**R3 — "Delight and power."** Lucky spin (weighted by R1–R2 usage), table view, tablet and
desktop layouts.

Phase order within R1: `1 → 2 → 3 → 4 → 5 → 7 → 10a`.

### Responsive, R3 only

- ≥768px: nav becomes a left rail, cards 2-up, filter sheet becomes a 380px right panel, sort
  becomes a dropdown.
- ≥1200px: persistent filter sidebar, cards 3-up, 40/60 list|map split with hover-linked
  pins, full table without horizontal scroll.

## Auth

Unchanged and working — it is just no longer the whole app. Full detail in git history; the
rules that still bind:

- ⚠️ `User.avatar_url` was renamed from `avatarUrl` (2026-10-21) ahead of the Go change.
  **The header avatar renders blank until the backend ships snake_case on `/api/me`** — the
  payload still sends `avatarUrl`, which now reads as `undefined` with no type error.
- Session is an **HttpOnly `sid` cookie** the backend sets. The SPA never sees a credential.
- `csrf` cookie (not HttpOnly, on purpose) is echoed as `X-CSRF-Token` on every non-safe
  method. `api/axios.ts` does this; a hand-rolled `fetch` POST gets a 403 `FORBIDDEN`.
- **The client cannot read its own session, so it must ask.** `GET /api/me` _is_ the session
  check. Never infer auth from `document.cookie`.
- **Never persist auth state to `localStorage`** — no tokens, no expiry, no "logged in" flag.
- A 401 is terminal (no refresh endpoint). `api/axios.ts` redirects to `/login`, except on
  `/api/me`, where `RequireAuth` owns the failure so `location.state.from` survives.
- Sign-in is a **full-page navigation** to `GET {API}/api/auth/google/login`, never `fetch` —
  XHR cannot follow the 302 and the user must see Google's origin in the address bar.
- There is **no `/auth/callback` route**; the backend redirects straight to the target path.
- `return_to` is **not currently wired**: `googleSignInUrl()` takes no argument, so a user
  bounced from a page lands on `/`. `RequireAuth` still records the path in
  `location.state.from`, so re-enabling means re-adding the parameter on both sides.
- Session: 12h absolute + 30m idle, sliding. Nothing to refresh, no client-side timer.
- All requests go through `src/api/`. No direct `fetch`/`axios` elsewhere (enforced by lint).

## Rules for humans / AI writing frontend code

- Server state lives in TanStack Query; don't duplicate it into Zustand or `useState`.
- Client state that more than one screen needs goes in a Zustand store; everything else
  stays local `useState`. There is exactly one store today (`SearchQuery`) — resist adding
  a second before two screens actually share its state.
- One `SearchQuery` drives all result views. No second copy.
- Select atomically from Zustand. A selector returning a fresh object fails the `Object.is`
  check on every write and re-renders every consumer.
- Every string goes through i18n. Every number goes through `lib/format.ts`.
- Mocks live in one place and are obviously mocks. Don't scatter fixtures through components.
- `components/ui/` is owned by the shadcn CLI and may be overwritten — override at the call
  site, don't edit in place. Retokenising to the palette above is the one allowed exception.
- A change to the data contracts above → update `src/types/` in the same commit.
- Follow `.claude/rules/`: `typescript`, `javascript`, `react`, `shadcn`, `clean-code`,
  `code-comments`, `commit` (never commit unless asked). Where marked `[lint]`, `pnpm lint` enforces them.

## Implementation checklist

Done (auth era, committed):

- [x] Vite + Tailwind 4 + Router + Query scaffold, `host: true`
- [x] 15 shadcn/ui `radix-nova` primitives, Be Vietnam Pro, theme wiring
- [x] Cookie-session auth: `api/{axios,baseCursorAPI,endpoints,authAPI}.ts`, `lib/{csrf,errors,navigate}.ts`
- [x] LoginPage, RequireAuth. `useLogout` is ready, but no screen shows sign-out until R2 Account:
      the old `AppHeader` had the only button (see git history)
- [x] `viewport-fit=cover`, 44px touch targets, dark mode via `next-themes`

Blocked / needs input:

- [ ] **`02-component-breakdown.md` missing** — i18n keys and component props undefined
- [ ] **`03-database-analysis.md` missing** — no real API contract; everything is mocked
- [ ] Decide the map SDK (R2)

R1:

- [x] Phase 1 — tokens, i18next, `lib/format.ts` + `lib/normalize.ts` with tests, icon set
- [x] Phase 2 — AppShell + BottomNav, routes, R1 nav items disabled
- [x] Phase 3 — Discover header, toolbar, PlaceCard list, infinite scroll
- [x] Phase 4 — `searchStore` (`SearchQuery`), FilterSheet with live count, SortSheet
- [x] Phase 5 — Location sheet: 3-level cascade + old-ward-name search
- [x] Phase 7 — Place detail + media grid (viewer is R2)
- [ ] Phase 10a — EmptyState, LoadingState, QA checklist
- [ ] Retokenise `components/ui/` to the terracotta palette
- [ ] Trim initial JS from 208 KB to under the 170 KB budget
- [ ] Check every screen at 360/375/390/430px, VI and EN, light and dark
- [ ] Real-device QA: iOS Safari (latest, latest-1), mid-range Android Chrome, 4G throttling
