/**
 * Centralised, typed access to build-time environment configuration.
 * Nothing else in the app should read `process.env` directly — import from here
 * so defaults and parsing live in one place. Expo inlines `EXPO_PUBLIC_*` vars
 * at build time.
 */

const DEFAULT_API_BASE_URL = "https://openlibrary.org"
const DEFAULT_COVERS_BASE_URL = "https://covers.openlibrary.org"

export interface AppEnv {
  /** Open Library JSON API origin (search + works). */
  readonly apiBaseUrl: string
  /** Open Library cover-image CDN origin. */
  readonly coversBaseUrl: string
  readonly enableAnalytics: boolean
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "")
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return value.trim().toLowerCase() === "true"
}

function resolveEnv(): AppEnv {
  const apiBaseUrl = trimTrailingSlash(
    process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
  )
  const coversBaseUrl = trimTrailingSlash(
    process.env.EXPO_PUBLIC_COVERS_BASE_URL?.trim() || DEFAULT_COVERS_BASE_URL
  )

  return {
    apiBaseUrl,
    coversBaseUrl,
    enableAnalytics: parseBoolean(process.env.EXPO_PUBLIC_ENABLE_ANALYTICS, false),
  }
}

export const ENV: AppEnv = resolveEnv()
