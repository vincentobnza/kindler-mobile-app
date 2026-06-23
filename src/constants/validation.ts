/**
 * Validation rules. Keep limits here so inputs and queries reference the same
 * values.
 */

export const VALIDATION_RULES = {
  search: {
    minLength: 2,
    maxLength: 96,
  },
} as const
