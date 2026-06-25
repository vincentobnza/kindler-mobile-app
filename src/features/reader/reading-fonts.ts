/**
 * The reading faces the reader offers for body text. All three are already
 * loaded at app start (see `app/_layout.tsx`), so switching is instant — no
 * extra font fetch. Headings keep their own serif; only the running prose
 * changes.
 */

import { FONTS } from "@/constants/theme"

export type ReadingFontKey = "literata" | "garamond" | "lexend"

export interface ReadingFontOption {
  key: ReadingFontKey
  /** Display name, also previewed in the font itself. */
  label: string
  /** Short descriptor shown beneath the name. */
  description: string
  /** Loaded font family applied to the reader's running prose. */
  family: string
}

export const READING_FONTS: readonly ReadingFontOption[] = [
  {
    key: "literata",
    label: "Literata",
    description: "Serif · designed for reading",
    family: FONTS.reading,
  },
  {
    key: "garamond",
    label: "EB Garamond",
    description: "Classic book serif",
    family: FONTS.serif,
  },
  {
    key: "lexend",
    label: "Lexend",
    description: "Sans-serif",
    family: FONTS.sans,
  },
] as const

export const DEFAULT_READING_FONT: ReadingFontKey = "literata"

/** Resolve a stored key to a loaded font family (falls back to the default). */
export function readingFontFamily(key: ReadingFontKey): string {
  const match = READING_FONTS.find((font) => font.key === key)
  return (match ?? READING_FONTS[0]).family
}
