/**
 * Colour-scheme preference — persisted client state via the zustand `persist`
 * middleware backed by AsyncStorage. Mirrors the shape of the saved-books and
 * reading-progress stores.
 *
 * This holds only the user's *preference* ("system" | "light" | "dark"). The
 * resolved scheme (which actually depends on the device setting when the
 * preference is "system") is computed in {@link ThemeProvider}.
 */

import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { STORAGE_KEYS } from "@/constants/storage-keys"

/** What the user picked. "system" follows the OS light/dark setting. */
export type ThemePreference = "system" | "light" | "dark"

/** The cycle order used by the in-app toggle: system → light → dark → system. */
export const THEME_PREFERENCE_CYCLE: readonly ThemePreference[] = [
  "system",
  "light",
  "dark",
] as const

interface ThemeState {
  preference: ThemePreference
  /** True once the persisted preference has been read back from storage. */
  hasHydrated: boolean
  setPreference: (preference: ThemePreference) => void
  /** Advance to the next preference in {@link THEME_PREFERENCE_CYCLE}. */
  cyclePreference: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      preference: "system",
      hasHydrated: false,
      setPreference: (preference) => set({ preference }),
      cyclePreference: () => {
        const current = get().preference
        const index = THEME_PREFERENCE_CYCLE.indexOf(current)
        const next =
          THEME_PREFERENCE_CYCLE[
            (index + 1) % THEME_PREFERENCE_CYCLE.length
          ]
        set({ preference: next })
      },
    }),
    {
      name: STORAGE_KEYS.themePreference,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ preference: state.preference }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true
      },
    }
  )
)
