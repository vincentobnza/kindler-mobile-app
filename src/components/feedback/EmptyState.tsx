import type { ReactNode } from "react"
import { StyleSheet, View } from "react-native"

import { STATE_IMAGES } from "@/constants/assets"
import { SPACING } from "@/constants/theme"
import { UI_LABELS } from "@/constants/ui-labels"
import { Text } from "@/components/ui/Text"

import { StateImage } from "./StateImage"

interface EmptyStateProps {
  title?: string
  description?: string
  /** Illustration. Defaults to the "books" state image. */
  illustration?: ReactNode
  action?: ReactNode
}

/** Centered empty-state block: illustration + title + description + action. */
export function EmptyState({
  title = UI_LABELS.states.empty,
  description,
  illustration,
  action,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {illustration ?? <StateImage source={STATE_IMAGES.booksEmpty} />}
      <View style={styles.copy}>
        <Text variant="h2" align="center">
          {title}
        </Text>
        {description ? (
          <Text
            variant="small"
            color="mutedForeground"
            align="center"
            style={styles.description}
          >
            {description}
          </Text>
        ) : null}
      </View>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING["5xl"],
  },
  copy: {
    gap: SPACING.xs,
    alignItems: "center",
  },
  description: {
    maxWidth: 320,
  },
  action: {
    marginTop: SPACING.xs,
  },
})
