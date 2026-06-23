# AGENTS.md

> Canonical engineering guide for **Kindler Mobile** — the Expo / React Native
> port of the Kindler reading app. It mirrors the web app's feature-based
> architecture and "paper & ink" design system.
>
> This is the single source of truth for coding standards. `CLAUDE.md` defers to
> this file. Keep it thin; change rules **here**.

## 1. Tech stack

| Concern       | Choice                                                  |
| ------------- | ------------------------------------------------------- |
| Runtime       | Expo SDK 54 · React Native 0.81 · New Architecture      |
| Language      | TypeScript (strict)                                     |
| Routing       | expo-router (file-based, typed routes)                  |
| Server state  | TanStack Query (`queryOptions` factories)               |
| Client state  | Zustand (+ `persist` over AsyncStorage)                 |
| Styling       | Typed design tokens + `StyleSheet` (NO CSS / NativeWind) |
| Animation     | react-native-reanimated (worklets)                      |
| Images        | expo-image (memory + disk cache)                        |
| Icons         | `@expo/vector-icons` (Ionicons)                         |
| Vectors       | react-native-svg (empty-state line art)                 |
| Fonts         | `@expo-google-fonts` — Lexend + EB Garamond             |
| Haptics       | expo-haptics                                            |
| Quality       | TypeScript, ESLint (`eslint-config-expo`)               |

## 2. Folder structure

The repo has **two** top-level code roots:

```text
app/           expo-router ROUTES ONLY — thin files that re-export a screen
src/           all application code (feature-based, imported via @/)
```

```text
app/
  _layout.tsx          Root stack: fonts, splash gate, providers, modal config
  (tabs)/
    _layout.tsx        Bottom tab bar (Discover / Browse / Library)
    index.tsx          → HomeScreen
    browse.tsx         → BrowseScreen
    library.tsx        → LibraryScreen
  book/[id].tsx        → BookDetailScreen (presented as a MODAL)
  +not-found.tsx

src/
  providers/   Composition root — AppProviders, query client
  config/      Typed env access (the ONLY reader of process.env)
  constants/   theme, routes, endpoints, query keys, storage keys, labels, flags…
  types/       Shared domain + API types
  lib/         Framework-agnostic helpers — http, format, hooks
  components/  Cross-feature UI — ui / common / feedback / splash
  layout/      App chrome — TopBar, Brand
  features/    One folder per feature, fully self-contained
```

### ⚠️ Critical: never create `src/app`

expo-router treats a **`src/app`** directory as the routes root and it
**shadows the real `app/`** directory — every route 404s ("Unmatched route").
The composition root therefore lives in **`src/providers`**, not `src/app`.
The path alias is `@/* → ./src/*`.

### Feature anatomy

```text
features/<feature>/
  components/   Presentational components for this feature
  hooks/        React hooks (use*)
  services/     Data access — the only place that knows endpoint shapes
  queries/      TanStack Query option factories (queryOptions)
  stores/       Zustand stores (*-store.ts)
  screens/      Route-level components (re-exported by files in app/)
  constants/    Feature-local constants
  types.ts      Feature-local types
```

**Dependency direction:** `features/*` may import from `lib`, `components`,
`constants`, `config`, `types`, `layout`. `lib` and `components/ui` must NOT
import from `features`.

## 3. Naming conventions

| Thing              | Convention        | Example              |
| ------------------ | ----------------- | -------------------- |
| Folders            | kebab-case        | `saved-books/`       |
| Components / files | PascalCase        | `BookCard.tsx`       |
| Hooks              | `use` + camelCase | `useBookSearch.ts`   |
| Zustand stores     | `*-store.ts`      | `saved-books-store`  |
| Services           | `*-service.ts`    | `book-service.ts`    |
| Query factories    | `*-queries.ts`    | `book-queries.ts`    |
| Constants (values) | UPPER_SNAKE_CASE  | `QUERY_STALE_TIME_MS`|
| Imports            | absolute via `@/` | `@/lib/format/book`  |

## 4. Constants-first (NON-NEGOTIABLE)

No hardcoded strings, magic numbers, colours, font families or routes in a
component. Extract to `src/constants/`:

- Colours / spacing / radius / fonts / type scale → `theme.ts`
- Route paths + `buildPath` helpers → `routes.ts`
- API endpoints → `api-endpoints.ts`
- Query keys → `query-keys.ts`
- AsyncStorage keys → `storage-keys.ts`
- Tunables / timings / sizes → `app-config.ts`
- User-facing copy → `ui-labels.ts`
- Feature flags → `feature-flags.ts`

## 5. Data & state

- **Server state → TanStack Query.** Define a `queryOptions` factory in
  `queries/`; services return typed data via `apiClient` (never call `fetch` in
  a component). Use `QUERY_KEYS` for every key. Cache tuned in
  `providers/query-client.ts` (stale 5 min, gc 30 min, no retry on 4xx).
- **Client state → Zustand.** Keep stores small and action-oriented. Persist
  durable state with `persist` + `createJSONStorage(() => AsyncStorage)` and a
  `STORAGE_KEYS` name. Gate first paint on `hasHydrated` where it matters.
- **URL/param state → expo-router.** `useLocalSearchParams` is the source of
  truth for shareable/deep-linked state (e.g. Browse `?q=`).

## 6. Design system

- **Light-mode only.** Editorial "paper & ink": warm paper background
  (`#F7F4ED`), near-black ink (`#1A1714`), crisp **solid black hairline
  borders** (`BORDER_WIDTH = 1`). There is no dark theme.
- Style **only** with tokens from `constants/theme.ts` (`COLORS`, `SPACING`,
  `RADIUS`, `FONTS`, `TYPOGRAPHY`). Never hardcode a hex/size in a component.
- **Typography:** **Lexend** for UI/body (tightened tracking), **EB Garamond**
  for headings, book titles and long-form reading. Always render text through
  the shared `<Text variant=… color=… />` primitive.
- **No shadows.** Separate surfaces with the hairline `COLORS.border`, never
  elevation/shadow.
- **Brand:** the `Kindler.` wordmark is EB Garamond **800 ExtraBold Italic** in
  pure black (`BRAND_INK`). Same treatment on the splash.
- **Images:** use the shared `BookCover` (expo-image, fixed 2:3 ratio, memory +
  disk cache, fade-in, graceful title placeholder).

## 7. Navigation

- Primary nav is the native **bottom tab bar** (`app/(tabs)/_layout.tsx`),
  driven by `PRIMARY_NAV`, styled to the palette, with haptic tab presses.
- **Book detail is a modal.** `app/book/[id].tsx` is configured with
  `presentation: "modal"` in the root stack and a close (`✕`) button in the
  header — it slides up over the tabs. Tapping a `BookCard`/shelf item pushes it
  (with a light haptic).
- Build hrefs with `buildPath` (object form for dynamic/query routes so they
  satisfy typed routes); never hardcode a path.

## 8. Components & performance

- Function components only; type props with an explicit `interface`.
- Provide loading (skeleton), error (`ErrorState`) and empty (`EmptyState`)
  states for any async-backed view.
- **Lists are virtualized:** grids and shelves use `FlatList` (the library and
  search results share `BookGrid`, which exposes header/footer slots so each
  screen is one scrolling list).
- **React Compiler is on** (`app.json` › experiments) — it auto-memoizes, so
  avoid manual `useMemo`/`useCallback`/`memo` unless profiling demands it.
- Tune query freshness/caching via `app-config.ts`; debounce live search;
  request the cover size that matches the surface (`M` grid/shelf, `L` detail).

## 9. Splash

`AnimatedSplash` (Reanimated) plays once fonts load and the store hydrates: the
wordmark reveals (fade + scale + rise), a hairline rule draws out, the tagline
settles, then the scene fades up and away. Honours "reduce motion". The native
splash background matches the paper so there's no flash on hand-off.

## 10. Quality — before you finish

```bash
npm run typecheck   # tsc --noEmit, zero errors
npm run lint        # expo lint, zero warnings
```

## 11. Do's and Don'ts

**Do**

- Reuse primitives (`Text`, `Button`, `Input`, `Screen`, `EmptyState`).
- Put a new screen in `features/<f>/screens` and re-export it from a thin
  `app/` route file.
- Add copy to `UI_LABELS`, endpoints to `API_ENDPOINTS`, tokens to `theme.ts`.

**Don't**

- ❌ Create a `src/app` directory (it shadows the router root — see §2).
- ❌ Hardcode strings, routes, colours, font families or magic numbers.
- ❌ Read `process.env` outside `config/env.ts`.
- ❌ Call `fetch` directly in a component — go through a service.
- ❌ Add shadows/elevation — the design is border-led.
- ❌ Import `features/*` from `lib` or `components/ui`.
