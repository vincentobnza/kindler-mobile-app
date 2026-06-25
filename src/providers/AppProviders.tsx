import { useRef, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { ThemeProvider } from "@/theme"

import { createQueryClient } from "./query-client"

/**
 * Single composition point for app-wide context providers — gesture root,
 * safe-area insets and the TanStack Query cache. The query client is created
 * once and held in a ref so it survives re-renders.
 *
 * Lives in `src/providers` (NOT `src/app`) — expo-router treats a `src/app`
 * directory as the routes root, which would shadow the real `app/` directory.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = useRef<QueryClient>(createQueryClient())

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient.current}>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
