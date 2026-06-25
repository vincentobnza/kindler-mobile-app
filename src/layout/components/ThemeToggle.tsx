import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, StyleSheet } from "react-native";

import { showToast } from "@/components/feedback/toast/toast-store";
import {
  THEME_PREFERENCE_CYCLE,
  useTheme,
  type ThemePreference,
} from "@/theme";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/** Icon + accessibility/toast copy for each preference state. */
const PREFERENCE_META: Record<
  ThemePreference,
  { icon: IoniconName; label: string; toast: string }
> = {
  system: {
    icon: "phone-portrait-outline",
    label: "Theme: following system",
    toast: "Following system",
  },
  light: {
    icon: "sunny-outline",
    label: "Theme: light",
    toast: "Light mode",
  },
  dark: {
    icon: "moon-outline",
    label: "Theme: dark",
    toast: "Dark mode",
  },
};

/**
 * Top-bar control that cycles the colour scheme: system → light → dark. The
 * icon reflects the *current* preference; tapping advances it, with a haptic
 * tap and a brief toast so the third (system) state is discoverable.
 */
export function ThemeToggle() {
  const { colors, preference, cyclePreference } = useTheme();
  const meta = PREFERENCE_META[preference];

  function handlePress() {
    if (Platform.OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const index = THEME_PREFERENCE_CYCLE.indexOf(preference);
    const next =
      THEME_PREFERENCE_CYCLE[(index + 1) % THEME_PREFERENCE_CYCLE.length];
    cyclePreference();
    const nextMeta = PREFERENCE_META[next];
    showToast({ message: nextMeta.toast, icon: nextMeta.icon });
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={meta.label}
      accessibilityHint="Cycles between system, light and dark themes"
      onPress={handlePress}
      hitSlop={10}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name={meta.icon} size={22} color={colors.foreground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
  },
  pressed: {
    opacity: 0.6,
  },
});
