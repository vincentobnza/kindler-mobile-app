import type { ReactNode } from "react"
import { StyleSheet, View } from "react-native"

import { SPACING } from "@/constants/theme"
import { Text } from "@/components/ui/Text"

interface PageHeaderProps {
  title: string
  description?: string
  /** Trailing slot for actions (buttons). */
  actions?: ReactNode
}

/** Consistent page title block: heading + optional description and actions. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text variant="h1">{title}</Text>
        {description ? (
          <Text variant="small" color="mutedForeground">
            {description}
          </Text>
        ) : null}
      </View>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  copy: {
    flex: 1,
    gap: SPACING.xs,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
})
