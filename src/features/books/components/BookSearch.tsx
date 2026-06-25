import { Ionicons } from "@expo/vector-icons"
import { Pressable } from "react-native"

import { withAlpha } from "@/constants/theme"
import { useTheme } from "@/theme"
import { UI_LABELS } from "@/constants/ui-labels"
import { Input } from "@/components/ui/Input"

interface BookSearchProps {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}

/** Controlled search box for finding books (debounced upstream). */
export function BookSearch({ value, onChange, autoFocus }: BookSearchProps) {
  const { colors } = useTheme()
  return (
    <Input
      pill
      value={value}
      onChangeText={onChange}
      placeholder="Search by title, author or subject…"
      accessibilityLabel={UI_LABELS.actions.search}
      autoFocus={autoFocus}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
      leftSlot={
        <Ionicons
          name="search"
          size={18}
          color={withAlpha(colors.mutedForeground, 0.7)}
        />
      }
      rightSlot={
        value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={UI_LABELS.actions.clearSearch}
            onPress={() => onChange("")}
            hitSlop={8}
          >
            <Ionicons name="close" size={18} color={colors.mutedForeground} />
          </Pressable>
        ) : null
      }
    />
  )
}
