import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"
import { useColorScheme } from "react-native"
import * as SystemUI from "expo-system-ui"

import {
  DARK_COLORS,
  LIGHT_COLORS,
  type ThemeColors,
} from "@/constants/theme"

import {
  useThemeStore,
  type ThemePreference,
} from "./theme-store"

/** The two resolved colour schemes the app can render in. */
export type ColorScheme = "light" | "dark"

export interface ThemeValue {
  /** The active palette — swap target for every component's colours. */
  colors: ThemeColors
  /** The resolved scheme actually being rendered. */
  scheme: ColorScheme
  isDark: boolean
  /** What the user picked ("system" defers to the device setting). */
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
  /** Cycle system → light → dark → system (used by the top-bar toggle). */
  cyclePreference: () => void
}

const ThemeContext = createContext<ThemeValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
  /**
   * Pin the subtree to a fixed scheme, ignoring the user/system preference.
   * Used to keep the deliberately always-black onboarding on the light palette
   * (its light "paper" tokens are drawn as text over a black scene).
   */
  forceScheme?: ColorScheme
}

/**
 * Resolves and provides the active theme. The scheme is derived from the
 * persisted preference and — when that is "system" — the live device setting,
 * so following the OS reacts instantly without any stored state.
 */
export function ThemeProvider({ children, forceScheme }: ThemeProviderProps) {
  const systemScheme = useColorScheme()
  const preference = useThemeStore((state) => state.preference)
  const setPreference = useThemeStore((state) => state.setPreference)
  const cyclePreference = useThemeStore((state) => state.cyclePreference)

  const scheme: ColorScheme =
    forceScheme ??
    (preference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : preference)

  const isDark = scheme === "dark"
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS

  // Paint the native root background so OS-level surfaces (Android nav bar
  // backdrop, overscroll, rotation) never flash the opposite scheme. Skipped
  // for pinned subtrees so onboarding doesn't repaint the real app chrome.
  useEffect(() => {
    if (forceScheme) return
    void SystemUI.setBackgroundColorAsync(colors.background)
  }, [colors.background, forceScheme])

  const value = useMemo<ThemeValue>(
    () => ({
      colors,
      scheme,
      isDark,
      preference,
      setPreference,
      cyclePreference,
    }),
    [colors, scheme, isDark, preference, setPreference, cyclePreference]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

/** Read the active theme. Must be called under a {@link ThemeProvider}. */
export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return value
}
