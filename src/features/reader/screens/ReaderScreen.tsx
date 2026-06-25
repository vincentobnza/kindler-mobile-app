import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  type ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  READER_CHARS_PER_SECTION,
  READER_FONT_SCALE,
} from "@/constants/app-config";
import { COLORS, LAYOUT, RADIUS, SPACING } from "@/constants/theme";
import { UI_LABELS } from "@/constants/ui-labels";
import { formatAuthors } from "@/lib/format/book";
import { ApiError } from "@/lib/http/api-error";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useBook } from "@/features/books/hooks/useBook";

import { ReaderSection } from "../components/ReaderSection";
import { useBookText } from "../hooks/useBookText";
import { paginate } from "../lib/paginate";
import { useReadingProgressStore } from "../stores/reading-progress-store";

export function ReaderScreen({ bookId }: { bookId: string }) {
  const insets = useSafeAreaInsets();
  const book = useBook(bookId);
  const text = useBookText(bookId);

  const [fontScale, setFontScale] = useState<number>(READER_FONT_SCALE.default);
  // Captured once at mount so the saved position survives the first persist.
  const [initialSection] = useState(
    () => useReadingProgressStore.getState().pages[bookId] ?? 0,
  );
  const [topSection, setTopSection] = useState(initialSection);

  const listRef = useRef<FlatList<string[]>>(null);

  // The whole book is chunked into virtualized sections; pure + memoized.
  const sections = text.data
    ? paginate(text.data.paragraphs, READER_CHARS_PER_SECTION)
    : [];
  const totalSections = sections.length;

  const title = book.data?.title ?? "Reading";
  const authors = book.data ? formatAuthors(book.data.authors, 3) : "";

  // Persist the top visible section so the reader resumes here next time.
  useEffect(() => {
    if (totalSections === 0) return;
    const clamped = Math.min(topSection, totalSections - 1);
    useReadingProgressStore.getState().setPage(bookId, clamped);
  }, [bookId, topSection, totalSections]);

  // Viewability + scroll-recovery handlers must be stable for FlatList.
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const top = viewableItems[0]?.index;
      if (top != null) setTopSection(top);
    },
  ).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 20 }).current;
  const onScrollToIndexFailed = useRef(
    (info: { index: number; averageItemLength: number }) => {
      // No fixed row height, so jump to an estimated offset then snap exactly.
      listRef.current?.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: false,
      });
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index: info.index, animated: false });
      }, 80);
    },
  ).current;

  const topBar = (
    <View style={styles.topBar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={UI_LABELS.actions.back}
        onPress={() => router.back()}
        hitSlop={10}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={22} color={COLORS.foreground} />
        <Text variant="label">{UI_LABELS.actions.back}</Text>
      </Pressable>

      <View style={styles.fontControls}>
        <Button
          variant="outline"
          size="icon-sm"
          onPress={() =>
            setFontScale((s) =>
              Math.max(
                READER_FONT_SCALE.min,
                Number((s - READER_FONT_SCALE.step).toFixed(2)),
              ),
            )
          }
          disabled={fontScale <= READER_FONT_SCALE.min}
          accessibilityLabel={UI_LABELS.actions.decreaseFont}
        >
          <Text variant="caption">A</Text>
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onPress={() =>
            setFontScale((s) =>
              Math.min(
                READER_FONT_SCALE.max,
                Number((s + READER_FONT_SCALE.step).toFixed(2)),
              ),
            )
          }
          disabled={fontScale >= READER_FONT_SCALE.max}
          accessibilityLabel={UI_LABELS.actions.increaseFont}
        >
          <Text variant="body">A</Text>
        </Button>
      </View>
    </View>
  );

  if (text.isError) {
    const isNoFullText =
      text.error instanceof ApiError && text.error.status === 404;

    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {topBar}
        <View style={styles.centered}>
          {isNoFullText ? (
            <EmptyState
              title="Not available to read here"
              description={UI_LABELS.feedback.noFullText}
              action={
                book.data ? (
                  <Button
                    variant="outline"
                    label={UI_LABELS.actions.readOnline}
                    onPress={() =>
                      WebBrowser.openBrowserAsync(book.data!.openLibraryUrl)
                    }
                    leftIcon={
                      <Ionicons
                        name="open-outline"
                        size={16}
                        color={COLORS.foreground}
                      />
                    }
                  />
                ) : null
              }
            />
          ) : (
            <ErrorState error={text.error} onRetry={() => text.refetch()} />
          )}
        </View>
      </View>
    );
  }

  if (text.isPending) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {topBar}
        <View style={styles.centered}>
          <LoadingSpinner label={UI_LABELS.feedback.preparingText} />
        </View>
      </View>
    );
  }

  const progress =
    totalSections > 0
      ? ((Math.min(topSection, totalSections - 1) + 1) / totalSections) * 100
      : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {topBar}

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <FlatList
        ref={listRef}
        data={sections}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) => (
          <ReaderSection paragraphs={item} fontScale={fontScale} />
        )}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + SPACING["3xl"] },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.titleBlock}>
            <Text variant="h2" align="center" numberOfLines={3}>
              {title}
            </Text>
            {authors ? (
              <Text variant="small" color="mutedForeground" align="center">
                {authors}
              </Text>
            ) : null}
          </View>
        }
        ListFooterComponent={
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync(text.data.source.url)}
            hitSlop={8}
            style={styles.footer}
          >
            <Text variant="caption" color="mutedForeground" align="center">
              Full text from {text.data.source.provider}
            </Text>
          </Pressable>
        }
        extraData={fontScale}
        initialScrollIndex={
          initialSection > 0
            ? Math.min(initialSection, totalSections - 1)
            : undefined
        }
        onScrollToIndexFailed={onScrollToIndexFailed}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        // Keep a few screens mounted around the viewport for jank-free scroll,
        // while still virtualizing the rest of a long book.
        removeClippedSubviews={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={11}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: "100%",
    maxWidth: LAYOUT.maxContentWidth,
    alignSelf: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: LAYOUT.screenPaddingX,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginLeft: -SPACING.xs,
  },
  fontControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    height: 3,
    marginHorizontal: LAYOUT.screenPaddingX,
    backgroundColor: COLORS.muted,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.foreground,
  },
  list: {
    flex: 1,
    // No reading "card": text sits directly on the paper background.
    backgroundColor: "transparent",
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  titleBlock: {
    gap: SPACING.xs,
    paddingBottom: SPACING.xl,
  },
  footer: {
    paddingTop: SPACING.lg,
  },
});
