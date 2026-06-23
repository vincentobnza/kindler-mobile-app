import { useCallback, type ReactNode } from "react"
import { AccessibilityInfo, type StyleProp, type ViewStyle } from "react-native"
import { useFocusEffect } from "expo-router"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

interface SlideUpOnFocusProps {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

const OFFSET = 28
const DURATION = 360

/**
 * Gives its children a modal-style slide-up + fade entrance every time the
 * screen gains focus. Used for the Discover and Library tabs so switching to
 * them reads like presenting a page. Honours "reduce motion".
 */
export function SlideUpOnFocus({ children, style }: SlideUpOnFocusProps) {
  const translateY = useSharedValue(OFFSET)
  const opacity = useSharedValue(0)

  useFocusEffect(
    useCallback(() => {
      let cancelled = false
      AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
        if (cancelled) return
        if (reduce) {
          translateY.value = 0
          opacity.value = 1
          return
        }
        translateY.value = OFFSET
        opacity.value = 0
        translateY.value = withTiming(0, {
          duration: DURATION,
          easing: Easing.out(Easing.cubic),
        })
        opacity.value = withTiming(1, { duration: DURATION - 40 })
      })
      return () => {
        cancelled = true
      }
    }, [translateY, opacity])
  )

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
}
