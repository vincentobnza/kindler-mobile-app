import { Pressable, StyleSheet } from "react-native"
import { router } from "expo-router"

import { ROUTE_PATHS } from "@/constants/routes"
import { SITE } from "@/constants/site"
import { BRAND_INK, FONTS } from "@/constants/theme"
import { Text } from "@/components/ui/Text"

/** App wordmark, linking home. Serif, italic, extra-bold black — the signature. */
export function Brand() {
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

const styles = StyleSheet.create({
  wordmark: {
    fontFamily: FONTS.serifExtraBoldItalic,
    color: BRAND_INK,
  },
})
