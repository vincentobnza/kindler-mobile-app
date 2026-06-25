import { useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Platform, StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { FullWindowOverlay } from "react-native-screens"

import {
  BORDER_WIDTH,
  LAYOUT,
  RADIUS,
  SHADOW,
  SPACING,
  type ThemeColors,
} from "@/constants/theme"
import { useTheme, useThemedStyles } from "@/theme"
import { Text } from "@/components/ui/Text"

import { useToastStore } from "./toast-store"

const VISIBLE_MS = 2200

/**
 * Single global toast. An elegant paper card with a solid black hairline border
 * and sharp corners, sliding in from the top. Rendered above everything — even
 * native modals — via `FullWindowOverlay` on iOS. Driven by {@link useToastStore}
 * (call `showToast(...)`).
 */
export function ToastHost() {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const styles = useThemedStyles(makeStyles)
  const id = useToastStore((state) => state.id)
  const message = useToastStore((state) => state.message)
  const icon = useToastStore((state) => state.icon)
  const visible = useToastStore((state) => state.visible)
  const hide = useToastStore((state) => state.hide)

  const opacity = useSharedValue(0)
  const translateY = useSharedValue(24)

  useEffect(() => {
    if (!visible) return
    opacity.value = withTiming(1, { duration: 220 })
    translateY.value = withTiming(0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    })
    const timer = setTimeout(() => {
      translateY.value = withTiming(24, {
        duration: 240,
        easing: Easing.in(Easing.cubic),
      })
      opacity.value = withTiming(0, { duration: 220 }, (finished) => {
        if (finished) runOnJS(hide)()
      })
    }, VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [id, visible, opacity, translateY, hide])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  if (!visible) return null

  const content = (
    <View
      style={[
        styles.overlay,
        {
          paddingBottom:
            insets.bottom + LAYOUT.tabBarHeight + SPACING.md,
        },
      ]}
      pointerEvents="none"
    >
      <Animated.View style={[styles.toast, animatedStyle]}>
        {icon ? <Ionicons name={icon} size={18} color={colors.foreground} /> : null}
        <Text variant="label" numberOfLines={1} style={styles.message}>
          {message}
        </Text>
      </Animated.View>
    </View>
  )

  return Platform.OS === "ios" ? (
    <FullWindowOverlay>{content}</FullWindowOverlay>
  ) : (
    content
  )
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "flex-end",
      paddingHorizontal: LAYOUT.screenPaddingX,
    },
    toast: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      maxWidth: 440,
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.md,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH,
      borderColor: c.border,
      backgroundColor: c.card,
      ...SHADOW.floating,
    },
    message: {
      flexShrink: 1,
    },
  })
