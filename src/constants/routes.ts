/**
 * Route definitions for expo-router (file-based routing). `ROUTE_PATHS` holds
 * the static route strings; `buildPath` returns typed `Href` values ready to
 * pass to `router.push`/`navigate`/`<Link>`. Dynamic and query routes use the
 * object form so they satisfy typed routes.
 *
 * `bookId` is the Open Library work id WITHOUT the `/works/` prefix
 * (e.g. `OL893415W`); the service re-adds the prefix when calling the API.
 */

export const ROUTE_PATHS = {
  home: "/",
  browse: "/browse",
  library: "/library",
  /** Dynamic route template, expo-router `[id]` syntax. */
  bookDetail: "/book/[id]",
} as const

export const buildPath = {
  home: () => "/" as const,
  library: () => "/library" as const,
  browse: (query?: string) =>
    query
      ? ({ pathname: "/browse" as const, params: { q: query } })
      : ("/browse" as const),
  bookDetail: (bookId: string) =>
    ({ pathname: "/book/[id]" as const, params: { id: bookId } }),
} as const
