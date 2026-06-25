import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { buildPath } from "@/constants/routes";
import {
  BORDER_WIDTH,
  LAYOUT,
  RADIUS,
  SPACING,
  type ThemeColors,
} from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/theme";
import { UI_LABELS } from "@/constants/ui-labels";
import { formatAuthors } from "@/lib/format/book";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SaveButton } from "@/features/library/components/SaveButton";
import { useReadingProgressStore } from "@/features/reader/stores/reading-progress-store";

import { BookCover } from "../components/BookCover";
import { useBook } from "../hooks/useBook";

const MAX_SUBJECTS = 12;

/** Single-book detail: cover, description, subjects, save + read actions. */
export function BookDetailScreen({ bookId }: { bookId: string }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { data: book, isPending, isError, error, refetch } = useBook(bookId);
  const startedPage = useReadingProgressStore((state) => state.pages[bookId]);

  if (isError) {
    return (
      <View style={styles.centered}>
        <ErrorState error={error} onRetry={() => refetch()} />
      </View>
    );
  }

  if (isPending || !book) {
    return (
      <View style={styles.centered}>
        <LoadingSpinner label={UI_LABELS.states.loading} />
      </View>
    );
  }

  const authors = formatAuthors(book.authors, 4);
  const subjects = book.subjects.slice(0, MAX_SUBJECTS);

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + SPACING["4xl"] },
      ]}
    >
      <View style={styles.coverWrap}>
        <BookCover
          title={book.title}
          coverId={book.coverId}
          size="L"
          priority
        />
      </View>

      <View style={styles.titleBlock}>
        <Text variant="h1" align="center">
          {book.title}
        </Text>
        <Text variant="bodyLarge" color="mutedForeground" align="center">
          {authors}
        </Text>
      </View>

      {book.firstPublishDate ? (
        <View style={styles.metaRow}>
          <Ionicons
            name="calendar-outline"
            size={15}
            color={colors.mutedForeground}
          />
          <Text variant="small" color="mutedForeground">
            First published {book.firstPublishDate}
          </Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button
          label={
            startedPage && startedPage > 0
              ? UI_LABELS.actions.continueReading
              : UI_LABELS.actions.startReading
          }
          onPress={() => router.push(buildPath.bookRead(book.id))}
          leftIcon={
            <Ionicons
              name="book-outline"
              size={16}
              color={colors.primaryForeground}
            />
          }
        />
        <SaveButton
          book={{
            id: book.id,
            title: book.title,
            authors: book.authors,
            coverId: book.coverId,
          }}
          withLabel
        />
      </View>

      <View style={styles.section}>
        <Text variant="h3">About this book</Text>
        <Text variant="reading" color="foreground">
          {book.description ?? UI_LABELS.feedback.noDescription}
        </Text>
      </View>

      {subjects.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.subjectsHeading}>
            <Ionicons
              name="pricetag-outline"
              size={16}
              color={colors.mutedForeground}
            />
            <Text variant="h3">Subjects</Text>
          </View>
          <View style={styles.tags}>
            {subjects.map((subject) => (
              <View key={subject} style={styles.tag}>
                <Text variant="small" color="mutedForeground">
                  {subject}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: c.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.background,
  },
  content: {
    width: "100%",
    maxWidth: LAYOUT.maxContentWidth,
    alignSelf: "center",
    paddingHorizontal: LAYOUT.screenPaddingX,
    paddingTop: SPACING.lg,
    gap: SPACING.xl,
  },
  coverWrap: {
    width: 168,
    alignSelf: "center",
  },
  titleBlock: {
    gap: SPACING.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs + 2,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.md,
  },
  section: {
    gap: SPACING.md,
  },
  subjectsHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  tag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: BORDER_WIDTH,
    borderColor: c.border,
    backgroundColor: c.card,
  },
  });
