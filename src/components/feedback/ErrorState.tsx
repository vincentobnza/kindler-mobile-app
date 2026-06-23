import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"

import { STATE_IMAGES } from "@/constants/assets"
import { COLORS, SPACING } from "@/constants/theme"
import { UI_LABELS } from "@/constants/ui-labels"
import { ApiError } from "@/lib/http/api-error"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"

import { StateImage } from "./StateImage"

interface ErrorStateProps {
  title?: string
  description?: string
  error?: unknown
  onRetry?: () => void
}

function describeError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.isNotFound) return UI_LABELS.feedback.notFoundBody
    if (error.isNetworkError) return UI_LABELS.feedback.networkError
    return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

/** Centered error block with an optional retry action. */
export function ErrorState({
  title = UI_LABELS.states.error,
  description,
  error,
  onRetry,
}: ErrorStateProps) {
  const message =
    description ?? describeError(error, "An unexpected error occurred.")

  return (
    <View style={styles.container} accessibilityRole="alert">
      <StateImage source={STATE_IMAGES.error} size={132} />
      <Text variant="h3" align="center">
        {title}
      </Text>
      <Text
        variant="small"
        color="mutedForeground"
        align="center"
        style={styles.message}
      >
        {message}
      </Text>
      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          label={UI_LABELS.actions.retry}
          onPress={onRetry}
          leftIcon={
            <Ionicons name="refresh" size={16} color={COLORS.foreground} />
          }
          style={styles.retry}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING["5xl"],
  },
  message: {
    maxWidth: 320,
  },
  retry: {
    marginTop: SPACING.sm,
  },
})
