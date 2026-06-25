import { StyleSheet, View } from "react-native";

import {
  BORDER_WIDTH,
  LAYOUT,
  SPACING,
  type ThemeColors,
} from "@/constants/theme";
import { useThemedStyles } from "@/theme";

import { Brand } from "./Brand";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Slim, sticky top bar carrying the wordmark and the theme toggle — the
 * persistent chrome above every tab screen (the web's `TopBar`). Primary
 * navigation lives in the native bottom tab bar.
 */
export function TopBar() {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <Brand />
        <ThemeToggle />
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    bar: {
      borderBottomWidth: BORDER_WIDTH,
      borderBottomColor: c.border,
      backgroundColor: c.background,
    },
    inner: {
      width: "100%",
      maxWidth: LAYOUT.maxContentWidth,
      alignSelf: "center",
      height: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: LAYOUT.screenPaddingX,
      paddingVertical: SPACING.sm,
    },
  });
