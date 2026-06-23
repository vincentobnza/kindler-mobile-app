import { StyleSheet, View } from "react-native"

import { SPACING } from "@/constants/theme"
import { Skeleton } from "@/components/ui/Skeleton"

/**
 * Loading placeholder matching the BookCard footprint to avoid layout shift:
 * a 2:3 cover, a two-line title block and a single author line, with the same
 * spacing rhythm as the real card.
 */
export function BookCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton aspectRatio={2 / 3} />
      <View style={styles.meta}>
        <Skeleton height={16} width="92%" />
        <Skeleton height={16} width="58%" />
        <Skeleton height={12} width="40%" style={styles.author} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: SPACING.md,
  },
  meta: {
    gap: SPACING.xs + 2,
  },
  author: {
    marginTop: 2,
  },
})
