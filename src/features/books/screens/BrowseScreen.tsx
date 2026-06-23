import { Ionicons } from "@expo/vector-icons"
import { Keyboard, Pressable, StyleSheet, View } from "react-native"

import { STATE_IMAGES } from "@/constants/assets"
import {
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_PAGE_SIZE,
  SKELETON_GRID_COUNT,
} from "@/constants/app-config"
import { COLORS, LAYOUT, SPACING } from "@/constants/theme"
import { UI_LABELS } from "@/constants/ui-labels"
import { EmptyState } from "@/components/feedback/EmptyState"
import { ErrorState } from "@/components/feedback/ErrorState"
import { StateImage } from "@/components/feedback/StateImage"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"

import { BookCardSkeleton } from "../components/BookCardSkeleton"
import { BookGrid } from "../components/BookGrid"
import { BookSearch } from "../components/BookSearch"
import { useBookSearch } from "../hooks/useBookSearch"

/** Browse — a search modal over the Open Library (param/query driven). */
export function BrowseScreen() {
  const { input, setInput, term, page, setPage, query } = useBookSearch()

  const hasQuery = term.trim().length >= SEARCH_MIN_QUERY_LENGTH
  const total = query.data?.total ?? 0
  const books = query.data?.books ?? []
  const hasPrev = page > 1
  const hasNext = page * SEARCH_PAGE_SIZE < total

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <BookSearch value={input} onChange={setInput} autoFocus />
      </View>

      {!hasQuery ? (
        <Pressable style={styles.fill} onPress={Keyboard.dismiss}>
          <EmptyState
            illustration={<StateImage source={STATE_IMAGES.booksEmpty} />}
            title="Find your next read"
            description={UI_LABELS.feedback.searchPrompt}
          />
        </Pressable>
      ) : query.isError ? (
        <Pressable style={styles.fill} onPress={Keyboard.dismiss}>
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        </Pressable>
      ) : query.isPending ? (
        <Pressable style={styles.skeletonGrid} onPress={Keyboard.dismiss}>
          {Array.from({ length: SKELETON_GRID_COUNT }).map((_, index) => (
            <View key={index} style={styles.skeletonCell}>
              <BookCardSkeleton />
            </View>
          ))}
        </Pressable>
      ) : books.length === 0 ? (
        <Pressable style={styles.fill} onPress={Keyboard.dismiss}>
          <EmptyState
            illustration={<StateImage source={STATE_IMAGES.booksEmpty} />}
            description={UI_LABELS.feedback.emptyResults}
          />
        </Pressable>
      ) : (
        <BookGrid
          books={books}
          keyboardDismiss
          ListHeaderComponent={
            <Text variant="small" color="mutedForeground" style={styles.count}>
              {total.toLocaleString()} result{total === 1 ? "" : "s"} for “{term}”
            </Text>
          }
          ListFooterComponent={
            hasPrev || hasNext ? (
              <View style={styles.pagination}>
                <Button
                  variant="outline"
                  size="sm"
                  label="Previous"
                  disabled={!hasPrev}
                  onPress={() => setPage((current) => Math.max(1, current - 1))}
                  leftIcon={
                    <Ionicons name="chevron-back" size={16} color={COLORS.foreground} />
                  }
                />
                <Text variant="small" color="mutedForeground">
                  Page {page}
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  label="Next"
                  disabled={!hasNext}
                  onPress={() => setPage((current) => current + 1)}
                  rightIcon={
                    <Ionicons name="chevron-forward" size={16} color={COLORS.foreground} />
                  }
                />
              </View>
            ) : null
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: LAYOUT.screenPaddingX,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  fill: {
    flex: 1,
  },
  count: {
    paddingBottom: SPACING.md,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.lg,
    paddingHorizontal: LAYOUT.screenPaddingX,
  },
  skeletonCell: {
    width: "47%",
    flexGrow: 1,
  },
})
