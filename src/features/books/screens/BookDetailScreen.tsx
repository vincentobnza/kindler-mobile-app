import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BORDER_WIDTH,
  COLORS,
  LAYOUT,
  RADIUS,
  SPACING,
} from "@/constants/theme";
import { UI_LABELS } from "@/constants/ui-labels";
import { formatAuthors } from "@/lib/format/book";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SaveButton } from "@/features/library/components/SaveButton";

import { BookCover } from "../components/BookCover";
import { useBook } from "../hooks/useBook";

const MAX_SUBJECTS = 12;

/** Single-book detail: cover, description, subjects, save + read actions. */
export function BookDetailScreen({ bookId }: { bookId: string }) {
  const insets = useSafeAreaInsets();
  const { data: book, isPending, isError, error, refetch } = useBook(bookId);

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
            color={COLORS.mutedForeground}
          />
          <Text variant="small" color="mutedForeground">
            First published {book.firstPublishDate}
          </Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <SaveButton
          book={{
            id: book.id,
            title: book.title,
            authors: book.authors,
            coverId: book.coverId,
          }}
          withLabel
        />
        <Button
          variant="outline"
          label={UI_LABELS.actions.readOnline}
          onPress={() => WebBrowser.openBrowserAsync(book.openLibraryUrl)}
          leftIcon={
            <Ionicons name="open-outline" size={16} color={COLORS.foreground} />
          }
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
              color={COLORS.mutedForeground}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
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
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
});
