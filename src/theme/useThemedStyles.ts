import { useMemo } from "react"

import type { ThemeColors } from "@/constants/theme"

import { useTheme } from "./ThemeProvider"

/**
 * Resolves a palette-aware stylesheet, rebuilding it only when the scheme flips
 * (light ↔ dark) rather than on every render. Pair it with a module-scope
 * factory that calls `StyleSheet.create` itself, so style literals keep their
 * precise types:
 *
 * ```ts
 * const makeStyles = (c: ThemeColors) =>
 *   StyleSheet.create({ root: { backgroundColor: c.background } })
 *
 * function MyView() {
 *   const styles = useThemedStyles(makeStyles)
 *   // ...
 * }
 * ```
 *
 * Styles that depend on per-render values (an animated width, a prop) stay
 * inline — keep only the palette-derived rules in the factory.
 */
export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): T {
  const { colors } = useTheme()
  // `colors` is a stable module constant per scheme, so this recomputes only
  // when light ↔ dark changes — not on every render. `factory` is intentionally
  // excluded: callers pass a stable module-scope `makeStyles`, and keying on it
  // would defeat the memo for inline factories.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => factory(colors), [colors])
}
