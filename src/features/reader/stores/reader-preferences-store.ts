/**
 * Reader preferences shared across books — currently the chosen reading font.
 * Persisted via zustand `persist` + AsyncStorage, mirroring the reading-progress
 * and saved-books stores, so a reader's font choice sticks between sessions.
 */

import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { STORAGE_KEYS } from "@/constants/storage-keys"

import { DEFAULT_READING_FONT, type ReadingFontKey } from "../reading-fonts"

interface ReaderPreferencesState {
  fontKey: ReadingFontKey
  setFontKey: (fontKey: ReadingFontKey) => void
}

export const useReaderPreferencesStore = create<ReaderPreferencesState>()(
  persist(
    (set) => ({
      fontKey: DEFAULT_READING_FONT,
      setFontKey: (fontKey) => set({ fontKey }),
    }),
    {
      name: STORAGE_KEYS.readerPreferences,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
