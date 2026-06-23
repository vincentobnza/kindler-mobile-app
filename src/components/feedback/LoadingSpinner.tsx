import { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

import { COLORS, SPACING } from "@/constants/theme"
import { Text } from "@/components/ui/Text"

const BOXES = [0, 1, 2]
const BOX_SIZE = 12
const RISE = 6
const DURATION = 450

/** A single ink box that rises and brightens, offset by its index. */
function PixelBox({ index }: { index: number }) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(
      index * 150,
      withRepeat(
        withTiming(1, { duration: DURATION, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    )
  }, [index, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + progress.value * 0.75,
    transform: [{ translateY: -progress.value * RISE }],
  }))

  return <Animated.View style={[styles.box, animatedStyle]} />
}

interface LoadingSpinnerProps {
  label?: string
}

/**
 * Pixel-style loader: three ink boxes that rise and brighten in sequence,
 * stacked above an optional label. Mirrors the web's signature loader.
 */
export function LoadingSpinner({ label }: LoadingSpinnerProps) {
  return (
    <View style={styles.wrapper} accessibilityRole="progressbar">
      <View style={styles.row}>
        {BOXES.map((index) => (
          <PixelBox key={index} index={index} />
        ))}
      </View>
      {label ? (
        <Text variant="h3" color="mutedForeground">
          {label}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: SPACING.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SPACING.xs + 2,
    height: BOX_SIZE + RISE,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: COLORS.foreground,
  },
})
