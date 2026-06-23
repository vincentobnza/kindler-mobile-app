# Kindler — Mobile (Expo / React Native)

## Project overview

Kindler Mobile is the native iOS/Android edition of the Kindler reading app,
built with **Expo** and **React Native**. Users discover, search, view and save
books from the **Open Library API**. There is no backend: book data is fetched
directly from Open Library, and saved books are persisted on-device with
AsyncStorage.

It is a faithful port of the Kindler web app — same feature-based architecture
and the same warm, editorial **paper & ink** design language — adapted to feel
fully native (bottom tabs, modal presentation, haptics, gesture dismissal,
animated splash).

## Objectives

- Discover curated books across subject shelves
- Search books by title, author or subject
- View book details (cover, description, subjects) and read online
- Save favourite books locally and revisit them
- A premium, native, animated reading experience

## Platform & stack

Expo SDK 54 · React Native 0.81 (New Architecture) · TypeScript (strict) ·
expo-router · TanStack Query · Zustand (+ AsyncStorage) · Reanimated ·
expo-image · react-native-svg · expo-haptics · `@expo/vector-icons`.

## API — Open Library

Base URL: `https://openlibrary.org`

| Purpose      | Endpoint                                         |
| ------------ | ------------------------------------------------ |
| Search       | `/search.json?q={query}`                         |
| Subject      | `/subjects/{slug}.json`                          |
| Work detail  | `/works/{id}.json`                               |
| Author       | `/authors/{id}.json`                             |
| Cover images | `https://covers.openlibrary.org/b/id/{id}-L.jpg` |

Overridable via `EXPO_PUBLIC_API_BASE_URL` / `EXPO_PUBLIC_COVERS_BASE_URL`
(see `.env.example`).

## Navigation model

- **Bottom tabs:** **Discover** and **Library** (native tab bar, haptic
  presses). Both replay a modal-style slide-up entrance on focus.
- **Browse** is a **modal** (`presentation: "modal"`) opened by tapping the
  search bar on Discover; it hosts the live, debounced search.
- **Book detail** is a **modal** opened from any book card/shelf item, with a
  close button.

## Design system

- Light-mode "paper & ink": warm paper `#F7F4ED`, near-black ink `#1A1714`,
  solid hairline borders, **no shadows**.
- **Sharp, square corners everywhere** for an editorial feel — the lone
  exception is the **search bar**, which is a full pill.
- Typography: **Lexend** (UI/body), **EB Garamond** (headings & reading). The
  `Kindler.` wordmark is EB Garamond **800 ExtraBold Italic** in black.
- Empty/error states use the illustration set in `assets/states/`.

## State & data

- **Server state:** TanStack Query via `queryOptions` factories, fed by typed
  services calling a shared `apiClient`. Cache: 5-min stale, 30-min gc, no retry
  on 4xx.
- **Client state:** a small Zustand store persisted to AsyncStorage holds the
  saved-books library.

## Splash

A Reanimated `AnimatedSplash` plays once fonts load and the store hydrates:
animated wordmark reveal (fade + scale + rise), an expanding hairline rule, the
tagline, then a fade-away hand-off. Honours "reduce motion".

## Architecture & conventions

Feature-based. `app/` holds expo-router routes only; all code lives in `src/`.
See **[AGENTS.md](./AGENTS.md)** for the full engineering guide.

> ⚠️ Never create a `src/app` directory — expo-router treats it as the routes
> root and it shadows the real `app/` (every route 404s with "Unmatched route").
> The composition root lives in `src/providers`.
