import { Ionicons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import * as Haptics from "expo-haptics"
import { router } from "expo-router"
import { FlatList, Pressable, StyleSheet, View } from "react-native"

import { buildPath } from "@/constants/routes"
import { LAYOUT, SPACING } from "@/constants/theme"
import { useTheme } from "@/theme"
import { UI_LABELS } from "@/constants/ui-labels"
import { formatAuthors } from "@/lib/format/book"
import { SectionHeader } from "@/components/common/SectionHeader"
import { Skeleton } from "@/components/ui/Skeleton"
import { Text } from "@/components/ui/Text"

import type { Shelf } from "../constants/discover"
import { subjectQueryOptions } from "../queries/book-queries"
import { BookCover } from "./BookCover"

const ITEM_WIDTH = 128
const PLACEHOLDERS = [0, 1, 2, 3, 4]

/** A horizontally-scrolling shelf of books for a single subject. */
export function BookShelf({ shelf }: { shelf: Shelf }) {
  const { colors } = useTheme()
  const { data, isPending, isError } = useQuery(subjectQueryOptions(shelf.subject))

  // A broken/empty shelf shouldn't leave a hole in the page.
  if (isError || (!isPending && (!data || data.length === 0))) return null

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeader
          title={shelf.title}
          action={
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`${UI_LABELS.actions.viewAll} ${shelf.title}`}
              onPress={() => router.navigate(buildPath.browse(shelf.query))}
              hitSlop={8}
              style={styles.viewAll}
            >
              <Text variant="label" color="primary">
                {UI_LABELS.actions.viewAll}
              </Text>
              <Ionicons name="arrow-forward" size={15} color={colors.primary} />
            </Pressable>
          }
        />
      </View>

      {isPending ? (
        <View style={styles.loadingRail}>
          {PLACEHOLDERS.map((index) => (
            <View key={index} style={styles.item}>
              <Skeleton aspectRatio={2 / 3} />
              <Skeleton height={14} width="75%" />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          data={data}
          keyExtractor={(book) => book.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rail}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                router.push(buildPath.bookDetail(item.id))
              }}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            >
              <BookCover
                title={item.title}
                coverId={item.coverId}
                coverEdition={item.coverEdition}
                recyclingKey={item.id}
              />
              <Text variant="h3" numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>
              <Text variant="caption" color="mutedForeground" numberOfLines={1}>
                {formatAuthors(item.authors)}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: SPACING.lg,
  },
  header: {
    paddingHorizontal: LAYOUT.screenPaddingX,
  },
  rail: {
    paddingHorizontal: LAYOUT.screenPaddingX,
    gap: SPACING.lg,
  },
  loadingRail: {
    flexDirection: "row",
    paddingHorizontal: LAYOUT.screenPaddingX,
    gap: SPACING.lg,
    overflow: "hidden",
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  item: {
    width: ITEM_WIDTH,
    gap: SPACING.xs,
  },
  pressed: {
    opacity: 0.85,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 2,
  },
})
