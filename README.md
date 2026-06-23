# Kindler — Read more, beautifully

The **Expo / React Native** edition of Kindler — a fast reading companion to
discover, search and save books from the [Open Library](https://openlibrary.org).
No account, no API key, no backend. A faithful native port of the web app's
warm, editorial **paper & ink** design.

## Stack

Expo SDK 54 · React Native 0.81 (New Architecture) · TypeScript (strict) ·
expo-router · TanStack Query · Zustand (+ AsyncStorage) · Reanimated ·
expo-image · react-native-svg · `@expo/vector-icons`.

Type: **Lexend** (UI/body) + **EB Garamond** (serif headings & reading).

## Getting started

```bash
# 1. Install
npm install

# 2. (optional) configure env — sensible Open Library defaults are used
cp .env.example .env

# 3. Run
npm run start        # Expo dev server (press i / a, or scan in Expo Go)
npm run ios          # iOS simulator
npm run android      # Android emulator
```

## Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run start`     | Start the Expo dev server            |
| `npm run ios`       | Open on the iOS simulator            |
| `npm run android`   | Open on the Android emulator         |
| `npm run typecheck` | TypeScript (`tsc --noEmit`)          |
| `npm run lint`      | ESLint (`eslint-config-expo`)        |

## Architecture

Feature-based, mirroring the web app. **`app/` holds routes only**; all code
lives in **`src/`** (imported via `@/`).

```text
app/         expo-router routes (thin re-exports) + tab & modal config
src/
  providers/   Composition root — providers, query client
  config/      Typed env access
  constants/   theme tokens, routes, endpoints, query keys, labels, flags
  types/       Shared domain + API types
  lib/         Framework-agnostic helpers — http, format, hooks
  components/  Cross-feature UI — ui / common / feedback / splash
  layout/      App chrome — TopBar, Brand
  features/    books · home · library (self-contained)
```

> ⚠️ Never create a `src/app` directory — expo-router treats it as the routes
> root and it shadows the real `app/`.

## Features

- **Discover** (`features/home`) — an animated hero with a search entry point
  plus curated, horizontally-scrolling subject shelves.
- **Browse** (`features/books`) — param-driven, debounced live search over the
  Open Library with covers, ratings, paging and loading / empty / error states.
  The book detail opens as a **modal** with cover, description, subjects and a
  "read online" link.
- **Library** (`features/library`) — save books to read later, persisted
  on-device via a Zustand store over AsyncStorage.

## Design & performance

Light-mode "paper & ink": warm paper (`#F7F4ED`), near-black ink, solid hairline
borders, no shadows. Server state flows through typed services → `queryOptions`
factories; client state lives in small Zustand stores. Lists are virtualized
(`FlatList`), images cached via `expo-image`, queries cached/deduped via TanStack
Query, and the **React Compiler** auto-memoizes components.

## Splash

A premium animated splash (`AnimatedSplash`, Reanimated): the wordmark reveals
with fade + scale + rise, a hairline rule draws out, the tagline settles, then
the scene fades away to the app. Honours "reduce motion".

## Data & credits

Book data and covers are provided by [Open Library](https://openlibrary.org), a
project of the Internet Archive. Kindler is an independent reading companion and
is not affiliated with Open Library or Amazon Kindle.
