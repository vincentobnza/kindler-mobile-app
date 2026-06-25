import { useMemo, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  BORDER_WIDTH,
  RADIUS,
  SPACING,
  TYPOGRAPHY,
  withAlpha,
  type ColorToken,
  type ThemeColors,
} from "@/constants/theme";
import { useTheme } from "@/theme";

import { Text } from "./Text";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";

export type ButtonSize = "sm" | "default" | "lg" | "icon" | "icon-sm";

export interface ButtonProps extends Omit<
  PressableProps,
  "style" | "children"
> {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface VariantStyle {
  container: ViewStyle;
  pressed: ViewStyle;
  color: ColorToken;
  underline?: boolean;
}

/** Builds the variant map from the active palette so colours track the theme. */
function buildVariants(c: ThemeColors): Record<ButtonVariant, VariantStyle> {
  return {
    default: {
      container: { backgroundColor: c.primary },
      pressed: { backgroundColor: withAlpha(c.primary, 0.9) },
      color: "primaryForeground",
    },
    secondary: {
      container: { backgroundColor: c.secondary },
      pressed: { backgroundColor: withAlpha(c.secondaryForeground, 0.12) },
      color: "secondaryForeground",
    },
    outline: {
      container: {
        backgroundColor: c.background,
        borderWidth: BORDER_WIDTH,
        borderColor: c.border,
      },
      pressed: { backgroundColor: c.muted },
      color: "foreground",
    },
    ghost: {
      container: { backgroundColor: "transparent" },
      pressed: { backgroundColor: c.muted },
      color: "foreground",
    },
    destructive: {
      container: { backgroundColor: withAlpha(c.destructive, 0.1) },
      pressed: { backgroundColor: withAlpha(c.destructive, 0.2) },
      color: "destructive",
    },
    link: {
      container: { backgroundColor: "transparent" },
      pressed: { opacity: 0.7 },
      color: "primary",
      underline: true,
    },
  };
}

const SIZES: Record<ButtonSize, ViewStyle> = {
  sm: { height: 36, paddingHorizontal: SPACING.md },
  default: { height: 42, paddingHorizontal: SPACING.lg },
  lg: { height: 48, paddingHorizontal: SPACING["2xl"] },
  icon: { height: 36, width: 36 },
  "icon-sm": { height: 32, width: 32 },
};

/**
 * Editorial button. Variants and sizes mirror the web's CVA button so call
 * sites map 1:1. Composes a leading/trailing icon slot with a label.
 */
export function Button({
  label,
  variant = "default",
  size = "default",
  leftIcon,
  rightIcon,
  children,
  fullWidth,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  const variants = useMemo(() => buildVariants(colors), [colors]);
  const v = variants[variant];
  const isLink = variant === "link";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        !isLink && styles.solid,
        v.container,
        SIZES[size],
        fullWidth && styles.fullWidth,
        pressed && !disabled ? v.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
      {...props}
    >
      {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
      {children ??
        (label ? (
          <Text
            variant="label"
            color={v.color}
            style={[styles.label, v.underline ? styles.underline : null]}
            numberOfLines={1}
          >
            {label}
          </Text>
        ) : null)}
      {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  solid: {
    borderRadius: RADIUS.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.label.fontSize,
  },
  underline: {
    textDecorationLine: "underline",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  disabled: {
    opacity: 0.5,
  },
});
