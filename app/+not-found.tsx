import { router } from "expo-router"
import { StyleSheet, View } from "react-native"

import { ROUTE_PATHS } from "@/constants/routes"
import { COLORS, SPACING, withAlpha } from "@/constants/theme"
import { UI_LABELS } from "@/constants/ui-labels"
import { Screen } from "@/components/common/Screen"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"

export default function NotFoundScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="display" style={styles.code}>
          404
        </Text>
        <Text variant="h2">{UI_LABELS.states.notFound}</Text>
        <Text variant="small" color="mutedForeground" align="center" style={styles.body}>
          {UI_LABELS.feedback.notFoundBody}
        </Text>
        <Button
          label={UI_LABELS.actions.backToHome}
          onPress={() => router.replace(ROUTE_PATHS.home)}
          style={styles.action}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING["2xl"],
  },
  code: {
    fontSize: 64,
    lineHeight: 72,
    color: withAlpha(COLORS.mutedForeground, 0.4),
  },
  body: {
    maxWidth: 320,
  },
  action: {
    marginTop: SPACING.sm,
  },
})
