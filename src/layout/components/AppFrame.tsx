import type { ReactNode } from "react"
import { StyleSheet, View } from "react-native"

import { BORDER_WIDTH, COLORS, LAYOUT } from "@/constants/theme"

/**
 * The app shell frame. Centers the entire experience — content *and* the bottom
 * tab bar — in a column capped at `max-w-5xl`, with solid hairline borders down
 * both sides. On phones the borders sit at the screen edges; on tablets the
 * column centers with paper margins, mirroring the web's editorial shell.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <View style={styles.outer}>
      <View style={styles.frame}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  frame: {
    flex: 1,
    width: "100%",
    maxWidth: LAYOUT.maxContentWidth,
    borderLeftWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
})
