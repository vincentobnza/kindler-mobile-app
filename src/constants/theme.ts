/**
 * Design tokens — the single source of truth for the app's visual identity.
 *
 * Mirrors the web app's semantic CSS variables: an editorial "paper & ink"
 * aesthetic — warm paper background (#F7F4ED), near-black ink, and crisp solid
 * black hairline borders. Light-mode only; there is no dark theme.
 *
 * Never hardcode a colour, radius, spacing value or font family in a component —
 * import from here so the palette lives in one place.
 */

/** Semantic colour palette (matches `src/index.css` :root tokens on web). */
export const COLORS = {
  /** Warm paper background (exact brand value). */
  background: "#F7F4ED",
  foreground: "#1A1714",

  /** Surfaces sit a touch brighter than the paper, separated by hairlines. */
  card: "#FFFDF7",
  cardForeground: "#1A1714",

  /** Primary = ink. Solid near-black buttons in the editorial style. */
  primary: "#1A1714",
  primaryForeground: "#F7F4ED",

  secondary: "#EFE9DD",
  secondaryForeground: "#1A1714",

  muted: "#EFE9DD",
  mutedForeground: "#000000",

  accent: "#E7E0D2",
  accentForeground: "#1A1714",

  /** oklch(0.55 0.2 27) — editorial red, used sparingly for destructive UI. */
  destructive: "#C0322B",
  destructiveForeground: "#FFFDF7",

  /** oklch(0.52 0.12 150) — muted green. */
  success: "#2F8F4E",
  successForeground: "#FFFDF7",

  /** Solid black hairlines — the defining trait of the design. */
  border: "#1A1714",
  ring: "#1A1714",
} as const

export type ColorToken = keyof typeof COLORS

/** Returns a token colour with an applied alpha (e.g. `bg-primary/10`). */
export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "")
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** 4px-based spacing scale (matches the web's Tailwind spacing rhythm). */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 48,
  "5xl": 64,
} as const

/**
 * Corner radii. The mobile app uses **sharp, square corners** everywhere for an
 * elegant, editorial feel — images, buttons, cards and badges are all crisp
 * (0). The lone exception is the **search bar**, which uses `full` (a pill).
 */
export const RADIUS = {
  sm: 0,
  md: 0,
  lg: 0,
  xl: 0,
  /** Reserved for the search bar pill. */
  full: 9999,
} as const

/** Hairline border width — the design is border-led, never shadow-led. */
export const BORDER_WIDTH = 1

/** Layout metrics. Content is capped (like the web's `max-w-5xl`) for tablets. */
export const LAYOUT = {
  screenPaddingX: 16,
  maxContentWidth: 720,
} as const

/**
 * Loaded font families. Names match the exports of `@expo-google-fonts/*`.
 * Lexend → UI/body (tightened tracking); EB Garamond → headings & reading.
 */
export const FONTS = {
  sans: "Lexend_400Regular",
  sansMedium: "Lexend_500Medium",
  sansSemiBold: "Lexend_600SemiBold",
  sansBold: "Lexend_700Bold",
  serif: "EBGaramond_400Regular",
  serifMedium: "EBGaramond_500Medium",
  serifSemiBold: "EBGaramond_600SemiBold",
  serifBold: "EBGaramond_700Bold",
  serifItalic: "EBGaramond_400Regular_Italic",
  /** Heaviest face — used for the wordmark / brand. */
  serifExtraBoldItalic: "EBGaramond_800ExtraBold_Italic",
} as const

/** Pure black, reserved for the high-emphasis brand wordmark. */
export const BRAND_INK = "#000000"

/**
 * Typography variants consumed by the shared `Text` component. Sizes/leading
 * mirror the web's Tailwind type scale; `letterSpacing` is absolute (RN points)
 * and approximates the web's `-0.03em` (body) / `-0.015em` (headings) tracking.
 */
export const TYPOGRAPHY = {
  /** Hero / large display heading (serif). */
  display: {
    fontFamily: FONTS.serifSemiBold,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -0.6,
  },
  /** Page-level h1 (serif). */
  h1: {
    fontFamily: FONTS.serifSemiBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.45,
  },
  /** Section heading (serif). */
  h2: {
    fontFamily: FONTS.serifSemiBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.36,
  },
  /** Sub-section heading (serif). */
  h3: {
    fontFamily: FONTS.serifSemiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  /** Default body copy (sans). */
  body: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.48,
  },
  /** Larger body / lead copy (sans). */
  bodyLarge: {
    fontFamily: FONTS.sans,
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: -0.54,
  },
  /** Long-form reading copy (serif, relaxed measure, normal tracking). */
  reading: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    lineHeight: 31,
    letterSpacing: 0,
  },
  /** Small UI text (sans). */
  small: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.42,
  },
  /** Smallest UI text / metadata (sans). */
  caption: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.36,
  },
  /** Medium-weight label (sans). */
  label: {
    fontFamily: FONTS.sansMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.42,
  },
} as const

export type TypographyVariant = keyof typeof TYPOGRAPHY
