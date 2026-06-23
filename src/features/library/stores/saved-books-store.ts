/**
 * Saved-books library — persisted client state via the zustand `persist`
 * middleware backed by AsyncStorage. State is keyed by book id for O(1) lookup;
 * `toggle` returns the new saved status so callers can react without re-reading
 * the store.
 */

import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { STORAGE_KEYS } from "@/constants/storage-keys"

import type { SaveableBook, SavedBook } from "../types"

function toSavedBook(book: SaveableBook): SavedBook {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors,
    coverId: book.coverId,
    coverEdition: book.coverEdition,
    firstPublishYear: book.firstPublishYear,
    addedAt: Date.now(),
  }
}

interface LibraryState {
  items: Record<string, SavedBook>
  /** True once persisted state has been read back from AsyncStorage. */
  hasHydrated: boolean
  add: (book: SaveableBook) => void
  remove: (id: string) => void
  /** Adds/removes a book and returns whether it is now saved. */
  toggle: (book: SaveableBook) => boolean
  clear: () => void
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      items: {},
      hasHydrated: false,
      add: (book) =>
        set((state) => ({
          items: { ...state.items, [book.id]: toSavedBook(book) },
        })),
      remove: (id) =>
        set((state) => {
          if (!state.items[id]) return state
          const next = { ...state.items }
          delete next[id]
          return { items: next }
        }),
      toggle: (book) => {
        const isSaved = Boolean(get().items[book.id])
        if (isSaved) get().remove(book.id)
        else get().add(book)
        return !isSaved
      },
      clear: () => set({ items: {} }),
    }),
    {
      name: STORAGE_KEYS.library,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true
      },
    }
  )
)
