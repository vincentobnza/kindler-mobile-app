import { StyleSheet, View } from "react-native";

import { BORDER_WIDTH, COLORS, LAYOUT, SPACING } from "@/constants/theme";

import { Brand } from "./Brand";

/**
 * Slim, sticky top bar carrying the wordmark — the persistent chrome above
 * every tab screen (the web's `TopBar`). Primary navigation lives in the
 * native bottom tab bar.
 */
export function TopBar() {
  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <Brand />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderBottomWidth: BORDER_WIDTH,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  inner: {
    width: "100%",
    maxWidth: LAYOUT.maxContentWidth,
    alignSelf: "center",
    height: 52,
    justifyContent: "center",
    paddingHorizontal: LAYOUT.screenPaddingX,
    paddingVertical: SPACING.sm,
  },
});
