import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"

import { INPUT_DEBOUNCE_MS } from "@/constants/app-config"
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue"

import { searchBooksQueryOptions } from "../queries/book-queries"

/**
 * Search experience for the Browse screen. An incoming `?q=` route param (set by
 * the hero search and shelf "View all" links, and by deep links) seeds the
 * input; from there the input debounces and drives the TanStack Query result.
 * A new term resets paging to the first page.
 */
export function useBookSearch() {
  const params = useLocalSearchParams<{ q?: string }>()
  const incomingQuery = typeof params.q === "string" ? params.q : ""

  const [input, setInput] = useState(incomingQuery)

  // Sync the input when an external query arrives via navigation. This
  // render-time reset is React's recommended alternative to a sync effect.
  const [seenQuery, setSeenQuery] = useState(incomingQuery)
  if (incomingQuery !== seenQuery) {
    setSeenQuery(incomingQuery)
    setInput(incomingQuery)
  }

  const term = useDebouncedValue(input, INPUT_DEBOUNCE_MS)
  const [page, setPage] = useState(1)

  // A new search term always returns to the first page.
  const [termForPage, setTermForPage] = useState(term)
  if (term !== termForPage) {
    setTermForPage(term)
    setPage(1)
  }

  const query = useQuery(searchBooksQueryOptions(term, page))

  return { input, setInput, term, page, setPage, query }
}
