import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { FEATURE_FLAGS } from "@/constants/feature-flags";
import { buildPath } from "@/constants/routes";
import {
  RADIUS,
  SPACING,
  withAlpha,
  type ThemeColors,
} from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/theme";
import { formatAuthors, formatRating } from "@/lib/format/book";
import { Text } from "@/components/ui/Text";
import { SaveButton } from "@/features/library/components/SaveButton";

import { BookCover } from "./BookCover";

/**
 * Minimal data a card needs. Satisfied by both the `Book` search/shelf model
 * and the persisted `SavedBook`, so the library reuses this card directly.
 */
export interface BookCardItem {
  id: string;
  title: string;
  authors: string[];
  coverId?: number;
  coverEdition?: string;
  firstPublishYear?: number;
  ratingsAverage?: number;
  hasFulltext?: boolean;
}

/** Tappable, saveable cover card for a single book (grid item). */
export function BookCard({ book }: { book: BookCardItem }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const rating = FEATURE_FLAGS.bookRatings
    ? formatRating(book.ratingsAverage)
    : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={book.title}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(buildPath.bookDetail(book.id));
      }}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View>
        <BookCover
          title={book.title}
          coverId={book.coverId}
          coverEdition={book.coverEdition}
          recyclingKey={book.id}
        />
        <View style={styles.saveSlot}>
          <SaveButton book={book} />
        </View>
        {rating ? (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={11} color={colors.primary} />
            <Text variant="caption">{rating}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.meta}>
        <Text variant="h3" numberOfLines={2}>
          {book.title}
        </Text>
        <Text variant="small" color="mutedForeground" numberOfLines={1}>
          {formatAuthors(book.authors)}
        </Text>
        {book.firstPublishYear ? (
          <Text variant="caption" style={styles.year}>
            {book.firstPublishYear}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      gap: SPACING.md,
    },
    pressed: {
      opacity: 0.85,
    },
    saveSlot: {
      position: "absolute",
      top: SPACING.sm,
      right: SPACING.sm,
    },
    ratingBadge: {
      position: "absolute",
      top: SPACING.sm,
      left: SPACING.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 2,
      borderRadius: RADIUS.none,
      backgroundColor: withAlpha(c.card, 0.9),
    },
    meta: {
      gap: 2,
    },
    year: {
      color: withAlpha(c.mutedForeground, 0.8),
    },
  });
