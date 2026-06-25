import { useEffect } from "react"
import type { DimensionValue, StyleProp, ViewStyle } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

import { RADIUS } from "@/constants/theme"
import { useTheme } from "@/theme"

interface SkeletonProps {
  width?: DimensionValue
  height?: DimensionValue
  radius?: number
  /** Fixed width/height ratio (e.g. 2/3 for book covers) when height is auto. */
  aspectRatio?: number
  style?: StyleProp<ViewStyle>
}

/** Pulsing placeholder used while async content loads (no layout shift). */
export function Skeleton({
  width = "100%",
  height,
  radius = RADIUS.md,
  aspectRatio,
  style,
}: SkeletonProps) {
  const { colors } = useTheme()
  const opacity = useSharedValue(0.5)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          aspectRatio,
          borderRadius: radius,
          backgroundColor: colors.muted,
        },
        animatedStyle,
        style,
      ]}
    />
  )
}
