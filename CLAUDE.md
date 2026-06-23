# CLAUDE.md

Guidance for Claude / Claude Code working in this repository.

## Read this first

**[AGENTS.md](./AGENTS.md) is the canonical engineering guide.** Read it before
writing code. This file only highlights what matters most.

## TL;DR rules

- **Two roots:** `app/` holds expo-router **routes only** (thin re-exports);
  `src/` holds all app code, imported via `@/`.
- **⚠️ Never create `src/app`** — expo-router treats it as the routes root and
  it shadows the real `app/` directory (every route 404s). The composition root
  lives in `src/providers`.
- **Feature-based:** each feature in `src/features/<feature>/` owns its
  `components / hooks / services / queries / stores / screens / constants / types`.
- **Constants-first:** never hardcode routes, endpoints, query keys, storage
  keys, labels, colours, font families or magic numbers. Use `src/constants/*`
  (design tokens live in `constants/theme.ts`).
- **Server state → TanStack Query** via `queryOptions` factories, fed by typed
  `services/` that call `apiClient` (never `fetch` in a component).
- **Client state → Zustand**; persist durable state with `persist` +
  `AsyncStorage` + `STORAGE_KEYS`.
- **Styling → typed tokens + `StyleSheet`** (no NativeWind/CSS). Render all text
  through the shared `<Text>` primitive. **No shadows** — surfaces are separated
  by the solid hairline border.
- **Design:** light-mode only — warm paper (`#F7F4ED`), near-black ink, solid
  hairline borders. Lexend body, EB Garamond serif headings. Brand wordmark is
  EB Garamond 800 ExtraBold Italic in black.
- **Navigation:** native bottom tabs; **book detail is a modal**
  (`presentation: "modal"`). Lists are virtualized (`FlatList`). Card taps fire
  a light haptic.
- **Splash:** `AnimatedSplash` (Reanimated) — animated wordmark reveal.

## Before you finish

```bash
npm run typecheck && npm run lint
```
