import { useState } from "react"
import {
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { Image } from "expo-image"

import type { CoverSize } from "@/constants/api-endpoints"
import { COLORS, RADIUS, SPACING, withAlpha } from "@/constants/theme"
import { bookCoverUrl } from "@/lib/format/book"
import { Text } from "@/components/ui/Text"

interface BookCoverProps {
  title: string
  coverId?: number
  coverEdition?: string
  size?: CoverSize
  /** Higher priority decode for above-the-fold covers (e.g. detail screen). */
  priority?: boolean
  /** Stable key so recycled list rows don't flash the previous image. */
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
}

/**
 * Book cover image with a graceful, on-brand placeholder when the book has no
 * cover or the image fails to load. Always renders a 2:3 book aspect ratio (no
 * layout shift) and loads efficiently via `expo-image` (memory + disk cache,
 * fade-in transition).
 */
export function BookCover({
  title,
  coverId,
  coverEdition,
  size = "M",
  priority = false,
  recyclingKey,
  style,
}: BookCoverProps) {
  const src = bookCoverUrl({ coverId, coverEdition }, size)
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <View style={[styles.cover, styles.placeholder, style]}>
        <Text
          variant="h3"
          italic
          align="center"
          numberOfLines={3}
          style={styles.placeholderText}
        >
          {title}
        </Text>
      </View>
    )
  }

  return (
    <Image
      source={{ uri: src }}
      accessibilityLabel={`Cover of ${title}`}
      style={[styles.cover, style] as StyleProp<ImageStyle>}
      contentFit="cover"
      transition={priority ? 120 : 220}
      cachePolicy="memory-disk"
      priority={priority ? "high" : "normal"}
      recyclingKey={recyclingKey}
      onError={() => setFailed(true)}
    />
  )
}

const styles = StyleSheet.create({
  cover: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.muted,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  placeholderText: {
    color: withAlpha(COLORS.mutedForeground, 0.4),
  },
})
