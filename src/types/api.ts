/** Shared API types. */

/** Shape of a JSON error body the API may return. */
export interface ApiErrorBody {
  error?: string
  message?: string
  details?: string
}
