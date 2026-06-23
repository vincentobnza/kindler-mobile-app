import { useState, type ReactElement } from "react"
import {
  FlatList,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native"

import { LAYOUT, SPACING } from "@/constants/theme"

import { BookCard, type BookCardItem } from "./BookCard"

const GAP = SPACING.lg
const WIDE_BREAKPOINT = 640

interface BookGridProps {
  books: BookCardItem[]
  ListHeaderComponent?: ReactElement | null
  ListFooterComponent?: ReactElement | null
  ListEmptyComponent?: ReactElement | null
  contentContainerStyle?: StyleProp<ViewStyle>
  onRefresh?: () => void
  refreshing?: boolean
  /** Dismiss the keyboard on scroll / tap outside (used by the search modal). */
  keyboardDismiss?: boolean
}

/**
 * Responsive, virtualized grid of book cards (2 columns on phones, 3 on wide
 * screens). Built on `FlatList` so long result sets and the library stay smooth;
 * exposes header/footer slots so a screen renders a single scrolling list.
 */
export function BookGrid({
  books,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  contentContainerStyle,
  onRefresh,
  refreshing,
  keyboardDismiss = false,
}: BookGridProps) {
  const [width, setWidth] = useState(0)
  const columns = width >= WIDE_BREAKPOINT ? 3 : 2

  function handleLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width)
  }

  // Fixed item width keeps a trailing odd item from stretching full-width.
  const available = width - LAYOUT.screenPaddingX * 2
  const itemWidth =
    width > 0 ? (available - GAP * (columns - 1)) / columns : undefined

  return (
    <FlatList
      key={`cols-${columns}`}
      onLayout={handleLayout}
      data={books}
      keyExtractor={(book) => book.id}
      numColumns={columns}
      renderItem={({ item }) => (
        <View style={{ width: itemWidth }}>
          <BookCard book={item} />
        </View>
      )}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      onRefresh={onRefresh}
      refreshing={refreshing}
      keyboardDismissMode={keyboardDismiss ? "on-drag" : "none"}
      keyboardShouldPersistTaps={keyboardDismiss ? "handled" : "never"}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={6}
      windowSize={7}
    />
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: LAYOUT.screenPaddingX,
    paddingBottom: SPACING["4xl"],
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
})
