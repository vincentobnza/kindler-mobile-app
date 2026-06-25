import { useEffect, useRef, useState, type ReactNode } from "react"
import { Ionicons } from "@expo/vector-icons"
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from "react-native"
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import {
  BORDER_WIDTH,
  SPACING,
  withAlpha,
  type ThemeColors,
} from "@/constants/theme"
import { useTheme, useThemedStyles } from "@/theme"

import { Text } from "./Text"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

/** Distance (px) the panel is parked below the screen before it is measured. */
const FALLBACK_OFFSET = 600
/** Fraction of the panel height a drag must pass to dismiss on release. */
const CLOSE_DISTANCE_RATIO = 0.25
/** Downward fling velocity (px/s) that dismisses regardless of distance. */
const CLOSE_VELOCITY = 800

interface SheetProps {
  /** Whether the sheet is open. Toggling drives the enter/exit animation. */
  visible: boolean
  onClose: () => void
  /** Optional heading shown with a close affordance. */
  title?: string
  children: ReactNode
}

/**
 * A bottom sheet: a paper panel that slides up over a dimmed backdrop, anchored
 * to the bottom edge. Dismiss by dragging the grabber down, tapping the
 * backdrop, the close button, or the Android back button. Editorial styling —
 * solid hairline top border, sharp corners, a grabber.
 */
export function Sheet({ visible, onClose, title, children }: SheetProps) {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const styles = useThemedStyles(makeStyles)

  // Stay mounted through the exit animation, then unmount.
  const [mounted, setMounted] = useState(visible)
  const translateY = useSharedValue(FALLBACK_OFFSET)
  const panelOpacity = useSharedValue(0)
  const backdropOpacity = useSharedValue(0)
  const sheetHeight = useSharedValue(FALLBACK_OFFSET)
  const dragStartY = useSharedValue(0)
  const heightRef = useRef(0)
  const enteredRef = useRef(false)

  useEffect(() => {
    if (visible) {
      // Reset to the parked position; the entrance plays on first layout.
      enteredRef.current = false
      translateY.value = heightRef.current || FALLBACK_OFFSET
      panelOpacity.value = 0
      backdropOpacity.value = 0
      setMounted(true)
    } else if (mounted) {
      backdropOpacity.value = withTiming(0, { duration: 180 })
      panelOpacity.value = withTiming(0, { duration: 180 })
      translateY.value = withTiming(
        heightRef.current || FALLBACK_OFFSET,
        { duration: 220, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setMounted)(false)
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  function handleLayout(event: LayoutChangeEvent) {
    const { height } = event.nativeEvent.layout
    if (height) {
      heightRef.current = height
      sheetHeight.value = height
    }
    if (!visible || enteredRef.current) return
    enteredRef.current = true
    backdropOpacity.value = withTiming(1, { duration: 220 })
    panelOpacity.value = withTiming(1, { duration: 160 })
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    })
  }

  // Drag the grabber down to dismiss; release short of the threshold springs back.
  const dragGesture = Gesture.Pan()
    .activeOffsetY(8)
    .onBegin(() => {
      dragStartY.value = translateY.value
    })
    .onUpdate((event) => {
      const next = Math.max(0, dragStartY.value + event.translationY)
      translateY.value = next
      const height = sheetHeight.value || FALLBACK_OFFSET
      backdropOpacity.value = 1 - Math.min(next / height, 1)
    })
    .onEnd((event) => {
      const height = sheetHeight.value || FALLBACK_OFFSET
      const shouldClose =
        translateY.value > height * CLOSE_DISTANCE_RATIO ||
        event.velocityY > CLOSE_VELOCITY
      if (shouldClose) {
        // Hand off to `visible` → the close effect animates out from here.
        runOnJS(onClose)()
      } else {
        translateY.value = withTiming(0, {
          duration: 220,
          easing: Easing.out(Easing.cubic),
        })
        backdropOpacity.value = withTiming(1, { duration: 220 })
      }
    })

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))
  const panelStyle = useAnimatedStyle(() => ({
    opacity: panelOpacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  if (!mounted) return null

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.root}>
        <AnimatedPressable
          style={[styles.backdrop, backdropStyle]}
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.panel,
            panelStyle,
            { paddingBottom: insets.bottom + SPACING.xl },
          ]}
          onLayout={handleLayout}
        >
          <GestureDetector gesture={dragGesture}>
            <View style={styles.handleArea}>
              <View style={styles.handle} />
            </View>
          </GestureDetector>
          {title ? (
            <View style={styles.header}>
              <Text variant="h3">{title}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                hitSlop={10}
              >
                <Ionicons name="close" size={22} color={colors.foreground} />
              </Pressable>
            </View>
          ) : null}
          {children}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  )
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: withAlpha("#000000", 0.45),
    },
    panel: {
      width: "100%",
      alignSelf: "center",
      maxWidth: 640,
      backgroundColor: c.card,
      borderTopWidth: BORDER_WIDTH,
      borderColor: c.border,
      paddingHorizontal: SPACING.xl,
      paddingTop: SPACING.xs,
    },
    // Wide, tall-enough target so the grabber is comfortable to drag.
    handleArea: {
      alignItems: "center",
      paddingTop: SPACING.sm,
      paddingBottom: SPACING.lg,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: withAlpha(c.mutedForeground, 0.35),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: SPACING.md,
    },
  })
