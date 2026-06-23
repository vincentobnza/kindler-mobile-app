import type { ComponentProps } from "react"
import type { Ionicons } from "@expo/vector-icons"
import { create } from "zustand"

type IoniconName = ComponentProps<typeof Ionicons>["name"]

export interface ToastOptions {
  message: string
  icon?: IoniconName
}

interface ToastState {
  /** Increments on every show so the host can re-trigger its entrance. */
  id: number
  message: string
  icon?: IoniconName
  visible: boolean
  show: (options: ToastOptions) => void
  hide: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  id: 0,
  message: "",
  icon: undefined,
  visible: false,
  show: ({ message, icon }) =>
    set((state) => ({ id: state.id + 1, message, icon, visible: true })),
  hide: () => set({ visible: false }),
}))

/** Imperative helper so callers don't touch the store directly. */
export function showToast(options: ToastOptions): void {
  useToastStore.getState().show(options)
}
