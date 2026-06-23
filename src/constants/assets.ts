/** Static image assets, referenced via `require` so Metro bundles them. */

export const STATE_IMAGES = {
  /** Browse prompt / no-results. */
  booksEmpty: require("../../assets/states/books-empty-state-icon.png"),
  /** Empty saved-books library. */
  bookmarkEmpty: require("../../assets/states/bookmark-empty-state-icon.png"),
  /** Generic error state. */
  error: require("../../assets/states/error-state-image.png"),
} as const
