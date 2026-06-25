/** Namespaced AsyncStorage keys for all persisted client state. */

export const STORAGE_KEYS = {
  library: "kindler:library",
  /** Per-book reading position (current page), so the reader can resume. */
  readingProgress: "kindler:reading-progress",
  /** Colour-scheme preference: "system" | "light" | "dark". */
  themePreference: "kindler:theme-preference",
  /** Reader preferences (e.g. chosen reading font), shared across books. */
  readerPreferences: "kindler:reader-preferences",
} as const
