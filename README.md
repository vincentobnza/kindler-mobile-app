<div align="center">

<h1>📖 Kindler</h1>

<p><strong><em>Read more, beautifully.</em></strong></p>

<p>
  The <strong>Expo&nbsp;·&nbsp;React&nbsp;Native</strong> edition of Kindler — a fast, native reading
  companion to discover, search, <strong>read</strong> and save books from the
  <a href="https://openlibrary.org">Open&nbsp;Library</a>.<br />
  No account · no API key · no backend. A faithful native port of the web app's warm,
  editorial <strong>paper&nbsp;&amp;&nbsp;ink</strong> design.
</p>

<p>
  <img alt="Expo SDK 54" src="https://img.shields.io/badge/Expo_SDK-54-000020?logo=expo&logoColor=fff" />
  <img alt="React Native 0.81" src="https://img.shields.io/badge/React_Native-0.81-20232A?logo=react&logoColor=61DAFB" />
  <img alt="TypeScript strict" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=fff" />
  <img alt="Platforms: iOS and Android" src="https://img.shields.io/badge/iOS_·_Android-cross--platform-1A1714" />
</p>

<br />

<img alt="Kindler mobile app demo" src="assets/mobile_app_demo.gif" width="280" />

</div>

<hr />

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">
  <h3>🚀 Onboarding</h3>
  <p>
    A first-launch, full-bleed <strong>book wall over black</strong> with a single Continue
    CTA — the one deliberately dark screen in an otherwise light app.
  </p>
</td>
<td width="50%" valign="top">
  <h3>🧭 Discover</h3>
  <p>
    An animated hero with a search entry point, plus curated,
    horizontally-scrolling <strong>subject shelves</strong>.
    <br /><sub><code>features/home</code></sub>
  </p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
  <h3>🔍 Browse</h3>
  <p>
    A <strong>modal</strong> with param-driven, debounced live search over the Open Library —
    covers, ratings, paging and loading / empty / error states.
    <br /><sub><code>features/books</code></sub>
  </p>
</td>
<td width="50%" valign="top">
  <h3>📕 Book detail</h3>
  <p>
    A modal with cover, description and subjects — and two ways in:
    <strong>Read</strong> (in-app) or <strong>Read online</strong>.
    <br /><sub><code>features/books</code></sub>
  </p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
  <h3>📖 Reader</h3>
  <p>
    A premium <strong>in-app reading experience</strong>. Resolves a work's full text from the
    Open Library / Project Gutenberg, then renders a paginated, virtualized reader with
    a progress bar, <strong>resume position</strong>, font-size controls and a reading-font
    picker (Literata · EB Garamond · Lexend). Falls back gracefully to "read online"
    when no full text exists.
    <br /><sub><code>features/reader</code></sub>
  </p>
</td>
<td width="50%" valign="top">
  <h3>🔖 Library</h3>
  <p>
    Save books to read later, persisted <strong>on-device</strong> via a Zustand store over
    AsyncStorage.
    <br /><sub><code>features/library</code></sub>
  </p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
  <h3>🌗 Theming</h3>
  <p>
    System / light / dark, persisted across launches — the
    <strong>paper&nbsp;&amp;&nbsp;ink</strong> palette in both modes.
    <br /><sub><code>theme/</code></sub>
  </p>
</td>
<td width="50%" valign="top">
  <h3>🎬 Splash</h3>
  <p>
    A Reanimated wordmark reveal (fade + scale + rise), an expanding hairline rule,
    the tagline, then a fade-away hand-off. Honours <em>reduce motion</em>.
  </p>
</td>
</tr>
</table>

## 🧱 Stack

<table>
<tr><td><strong>Runtime</strong></td><td>Expo SDK 54 · React Native 0.81 (New Architecture) · React 19 · TypeScript (strict)</td></tr>
<tr><td><strong>Navigation</strong></td><td>expo-router · <code>@react-navigation/bottom-tabs</code></td></tr>
<tr><td><strong>Data</strong></td><td>TanStack Query · Zustand (+ AsyncStorage)</td></tr>
<tr><td><strong>UI / motion</strong></td><td>Reanimated · expo-image · expo-linear-gradient · react-native-svg · expo-haptics · <code>@expo/vector-icons</code></td></tr>
<tr><td><strong>Type</strong></td><td><strong>Lexend</strong> (UI/body) · <strong>EB&nbsp;Garamond</strong> (serif headings) · <strong>Literata</strong> (reading)</td></tr>
</table>

## ⚡ Getting started

```bash
# 1 · Install
npm install

# 2 · Configure env (optional — sensible Open Library defaults are used)
cp .env.example .env

# 3 · Run
npm run start     # Expo dev server — press i / a, or scan in Expo Go
npm run ios       # iOS simulator
npm run android   # Android emulator
```

Book data comes straight from the public Open Library API, so the app runs with zero
setup. Override <code>EXPO_PUBLIC_API_BASE_URL</code> / <code>EXPO_PUBLIC_COVERS_BASE_URL</code> to point elsewhere
(see <code>.env.example</code>).

## 📜 Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run start`     | Start the Expo dev server            |
| `npm run ios`       | Open on the iOS simulator            |
| `npm run android`   | Open on the Android emulator         |
| `npm run web`       | Run in the browser (react-native-web) |
| `npm run typecheck` | TypeScript (`tsc --noEmit`)          |
| `npm run lint`      | Lint (`expo lint`)                   |

## 🗂️ Architecture

Feature-based, mirroring the web app. **`app/` holds routes only**; all code lives in
**`src/`** (imported via `@/`).

<details open>
<summary><strong>Project structure</strong></summary>

```text
app/         expo-router routes (thin re-exports) + tab & modal config
src/
  providers/   Composition root — providers, query client
  theme/       Light/dark theme — store, provider, themed styles
  config/      Typed env access
  constants/   theme tokens, routes, endpoints, query keys, labels, flags
  types/       Shared domain + API types
  lib/         Framework-agnostic helpers — http, format, hooks
  components/  Cross-feature UI — ui / common / feedback / splash
  layout/      App chrome — TopBar, Brand
  features/    onboarding · home · books · library · reader (self-contained)
```

</details>

> [!WARNING]
> Never create a `src/app` directory — expo-router treats it as the routes root and it
> shadows the real `app/` (every route 404s with "Unmatched route").

## 🎨 Design & performance

"Paper & ink", now in **light and dark**: warm paper (<code>#F7F4ED</code>), near-black ink
(<code>#1A1714</code>), solid hairline borders, **no shadows**, and **sharp square corners
everywhere** — the lone exception being the search bar, a full pill. Server state flows
through typed services → <code>queryOptions</code> factories; client state lives in small Zustand
stores. Lists are virtualized (<code>FlatList</code>), images cached via <code>expo-image</code>, queries
cached / deduped via TanStack Query, and the <strong>React Compiler</strong> auto-memoizes
components.

<hr />

<div align="center">
  <sub>
    Book data and covers are provided by <a href="https://openlibrary.org">Open&nbsp;Library</a>,
    a project of the Internet&nbsp;Archive.<br />
    Kindler is an independent reading companion and is not affiliated with Open&nbsp;Library or Amazon&nbsp;Kindle.
  </sub>
</div>
