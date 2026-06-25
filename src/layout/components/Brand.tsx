import { Pressable, StyleSheet } from "react-native"
import { router } from "expo-router"

import { ROUTE_PATHS } from "@/constants/routes"
import { SITE } from "@/constants/site"
import { FONTS, type ThemeColors } from "@/constants/theme"
import { useThemedStyles } from "@/theme"
import { Text } from "@/components/ui/Text"

/** App wordmark, linking home. Serif, italic, extra-bold — the signature ink. */
export function Brand() {
  const styles = useThemedStyles(makeStyles)
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={SITE.name}
      onPress={() => router.navigate(ROUTE_PATHS.home)}
      hitSlop={8}
    >
      <Text variant="h2" style={styles.wordmark}>
        {SITE.name}.
      </Text>
    </Pressable>
  )
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wordmark: {
      fontFamily: FONTS.serifExtraBoldItalic,
      color: c.brand,
    },
  })
