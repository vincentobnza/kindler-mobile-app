/** Small, pure string formatters. Pure functions → trivially unit-testable. */

/** Truncates to `max` characters, appending an ellipsis when shortened. */
export function truncate(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`
}

/** Splits a string around the first occurrence of `emphasis` for inline styling. */
export function splitOnce(
  value: string,
  separator: string
): { before: string; match: string; after: string } {
  const index = value.indexOf(separator)
  if (index === -1) return { before: value, match: "", after: "" }
  return {
    before: value.slice(0, index),
    match: separator,
    after: value.slice(index + separator.length),
  }
}
