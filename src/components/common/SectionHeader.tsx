import type { ReactNode } from "react"
import { StyleSheet, View } from "react-native"

import { SPACING } from "@/constants/theme"
import { Text } from "@/components/ui/Text"

interface SectionHeaderProps {
  title: string
  action?: ReactNode
}

/** Prominent in-page section heading with an optional trailing action. */
export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text variant="h2" style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {action}
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
  title: {
    flexShrink: 1,
  },
})
