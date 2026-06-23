import { StyleSheet, View } from "react-native"

import { SPACING } from "@/constants/theme"
import { Skeleton } from "@/components/ui/Skeleton"

/**
 * Loading placeholder matching the BookCard footprint exactly to avoid layout
 * shift: a 2:3 cover, then a details block (same `gap: md` from the cover, same
 * tight `gap: 2` within) with two title lines and an author line.
 */
export function BookCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton aspectRatio={2 / 3} />
      <View style={styles.meta}>
        <Skeleton height={16} width="92%" />
        <Skeleton height={16} width="58%" />
        <Skeleton height={12} width="40%" />
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
    gap: 2,
  },
})
