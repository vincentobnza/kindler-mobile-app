import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet } from "react-native";

import { BORDER_WIDTH, RADIUS, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/theme";
import { UI_LABELS } from "@/constants/ui-labels";
import { showToast } from "@/components/feedback/toast/toast-store";
import { Button } from "@/components/ui/Button";

import { useLibraryStore } from "../stores/saved-books-store";
import type { SaveableBook } from "../types";

interface SaveButtonProps {
  book: SaveableBook;
  /** Render a full labelled button (detail screen) instead of an icon button. */
  withLabel?: boolean;
}

/** Toggles a book's saved status. Reads its own state from the store. */
export function SaveButton({ book, withLabel = false }: SaveButtonProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const isSaved = useLibraryStore((state) => Boolean(state.items[book.id]));
  const toggle = useLibraryStore((state) => state.toggle);

  const label = isSaved
    ? UI_LABELS.actions.removeFromLibrary
    : UI_LABELS.actions.saveToLibrary;

  function handleToggle() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nowSaved = toggle(book);
    showToast({
      message: nowSaved ? UI_LABELS.toasts.saved : UI_LABELS.toasts.removed,
      icon: nowSaved ? "bookmark" : "bookmark-outline",
    });
  }

  if (withLabel) {
    return (
      <Button
        variant={isSaved ? "secondary" : "outline"}
        label={label}
        accessibilityState={{ selected: isSaved }}
        onPress={handleToggle}
        leftIcon={
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={16}
            color={isSaved ? colors.secondaryForeground : colors.foreground}
          />
        }
      />
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSaved }}
      onPress={handleToggle}
      hitSlop={6}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <Ionicons
        name={isSaved ? "bookmark" : "bookmark-outline"}
        size={16}
        color={colors.foreground}
      />
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    iconButton: {
      width: 32,
      height: 32,
      borderRadius: RADIUS.full,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: BORDER_WIDTH,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    pressed: {
      backgroundColor: c.accent,
    },
  });
