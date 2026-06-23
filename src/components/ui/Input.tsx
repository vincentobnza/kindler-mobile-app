import { forwardRef, useState, type ReactNode } from "react"
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInput as RNTextInput,
  type TextInputProps,
  type ViewStyle,
} from "react-native"

import {
  BORDER_WIDTH,
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  withAlpha,
} from "@/constants/theme"

export interface InputProps extends TextInputProps {
  /** Slot rendered before the field (e.g. a search icon). */
  leftSlot?: ReactNode
  /** Slot rendered after the field (e.g. a clear button). */
  rightSlot?: ReactNode
  /** Render as a full pill (used by the hero search). */
  pill?: boolean
  /** Use the serif (heading) face for the typed text. */
  serif?: boolean
  containerStyle?: StyleProp<ViewStyle>
}

/**
 * Editorial text field — hairline border, on-brand focus highlight. Wraps the
 * native `TextInput` with optional leading/trailing slots so search and form
 * inputs share one look.
 */
export const Input = forwardRef<RNTextInput, InputProps>(function Input(
  {
    leftSlot,
    rightSlot,
    pill = false,
    serif = false,
    containerStyle,
    style,
    onFocus,
    onBlur,
    ...props
  },
  ref
) {
  const [focused, setFocused] = useState(false)

  return (
    <View
      style={[
        styles.container,
        pill ? styles.pill : styles.squared,
        focused && styles.focused,
        containerStyle,
      ]}
    >
      {leftSlot ? <View style={styles.slot}>{leftSlot}</View> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={withAlpha(COLORS.mutedForeground, 0.5)}
        selectionColor={COLORS.primary}
        cursorColor={COLORS.primary}
        style={[styles.input, serif && styles.serif, style]}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        {...props}
      />
      {rightSlot ? <View style={styles.slot}>{rightSlot}</View> : null}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  squared: {
    height: 44,
    borderRadius: RADIUS.md,
  },
  pill: {
    height: 52,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.card,
  },
  focused: {
    borderColor: COLORS.ring,
    backgroundColor: COLORS.card,
  },
  input: {
    flex: 1,
    color: COLORS.foreground,
    fontFamily: FONTS.sans,
    fontSize: 16,
    letterSpacing: -0.48,
    paddingVertical: 0,
  },
  serif: {
    fontFamily: FONTS.serif,
    fontSize: 17,
    letterSpacing: 0,
  },
  slot: {
    alignItems: "center",
    justifyContent: "center",
  },
})
