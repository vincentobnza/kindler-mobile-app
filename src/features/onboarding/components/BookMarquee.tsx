import { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { Image } from "expo-image"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

import { BORDER_WIDTH, COLORS } from "@/constants/theme"

const ITEM_W = 104
const ITEM_H = 156
const GAP = 12
const ROW_GAP = 14
/** Per-row config: direction + drift duration (slower = larger number). */
const ROWS = [
  { reverse: false, duration: 42000 },
  { reverse: true, duration: 52000 },
  { reverse: false, duration: 36000 },
] as const

const MIN_PER_ROW = 8

/** One infinitely-scrolling row of covers. */
function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: string[]
  reverse: boolean
  duration: number
}) {
  const setWidth = items.length * (ITEM_W + GAP)
  const from = reverse ? -setWidth : 0
  const to = reverse ? 0 : -setWidth
  const tx = useSharedValue(from)

  useEffect(() => {
    tx.value = from
    tx.value = withRepeat(
      withTiming(to, { duration, easing: Easing.linear }),
      -1,
      false
    )
  }, [from, to, duration, tx])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }))

  const doubled = [...items, ...items]

  return (
    <View style={styles.rowClip}>
      <Animated.View style={[styles.row, animatedStyle]}>
        {doubled.map((uri, index) =>
          uri ? (
            <Image
              key={index}
              source={{ uri }}
              style={styles.cover}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={300}
            />
          ) : (
            <View key={index} style={styles.cover} />
          )
        )}
      </Animated.View>
    </View>
  )
}

/**
 * An askew, slowly-drifting wall of book covers — three rows scrolling in
 * alternating directions, the whole group tilted for a dynamic, modern feel.
 * Falls back to muted placeholder tiles while covers load.
 */
export function BookMarquee({ coverUrls }: { coverUrls: string[] }) {
  const pool =
    coverUrls.length >= MIN_PER_ROW
      ? coverUrls
      : // Pad to a workable length with placeholders so the wall still drifts.
        [...coverUrls, ...Array<string>(MIN_PER_ROW * 3).fill("")]

  return (
    <View style={styles.wall}>
      {ROWS.map((row, rowIndex) => {
        // Rotate the pool per row so the three rows don't mirror each other.
        const offset = rowIndex * 5
        const items = [...pool.slice(offset), ...pool.slice(0, offset)].slice(
          0,
          Math.max(MIN_PER_ROW, Math.ceil(pool.length / ROWS.length))
        )
        return (
          <MarqueeRow
            key={rowIndex}
            items={items}
            reverse={row.reverse}
            duration={row.duration}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wall: {
    gap: ROW_GAP,
    transform: [{ rotate: "-10deg" }, { scale: 1.2 }],
  },
  rowClip: {
    height: ITEM_H,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
  },
  cover: {
    width: ITEM_W,
    height: ITEM_H,
    backgroundColor: COLORS.muted,
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.border,
  },
})
