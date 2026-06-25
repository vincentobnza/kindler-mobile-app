import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import { ApiError } from "@/lib/http/api-error";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Text } from "@/components/ui/Text";
import { useBook } from "@/features/books/hooks/useBook";

import { ReaderSection } from "../components/ReaderSection";
import { useBookText } from "../hooks/useBookText";
import { paginate } from "../lib/paginate";
import {
  DEFAULT_READING_FONT,
  READING_FONTS,
  readingFontFamily,
} from "../reading-fonts";
import { useReaderPreferencesStore } from "../stores/reader-preferences-store";
import { useReadingProgressStore } from "../stores/reading-progress-store";
import type { BookBlock } from "../types";

/** Light tactile tap shared by the reader's header controls. */
function tapFeedback() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function ReaderScreen({ bookId }: { bookId: string }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const book = useBook(bookId);
  const text = useBookText(bookId);

  const [fontScale, setFontScale] = useState<number>(READER_FONT_SCALE.default);

  // Reading font — a persisted, cross-book preference picked from a sheet.
  const fontKey = useReaderPreferencesStore((state) => state.fontKey);
  const setFontKey = useReaderPreferencesStore((state) => state.setFontKey);
  const fontFamily = readingFontFamily(fontKey ?? DEFAULT_READING_FONT);
  const [fontSheetOpen, setFontSheetOpen] = useState(false);

  // Captured once at mount so the saved position survives the first persist.
  const [initialSection] = useState(
    () => useReadingProgressStore.getState().pages[bookId] ?? 0,
  );
  const [topSection, setTopSection] = useState(initialSection);

  const listRef = useRef<FlatList<BookBlock[]>>(null);

  // The whole book is chunked into virtualized sections; pure + memoized.
  const sections = text.data
    ? paginate(text.data.blocks, READER_CHARS_PER_SECTION)
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
    <>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={UI_LABELS.actions.back}
          onPress={() => {
            tapFeedback();
            router.back();
          }}
          hitSlop={10}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          <Text variant="label">{UI_LABELS.actions.back}</Text>
        </Pressable>

        <View style={styles.fontControls}>
          <Button
            variant="outline"
            size="icon-sm"
            onPress={() => {
              tapFeedback();
              setFontSheetOpen(true);
            }}
            accessibilityLabel="Change reading font"
          >
            <Ionicons name="text-outline" size={16} color={colors.foreground} />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onPress={() => {
              tapFeedback();
              setFontScale((s) =>
                Math.max(
                  READER_FONT_SCALE.min,
                  Number((s - READER_FONT_SCALE.step).toFixed(2)),
                ),
              );
            }}
            disabled={fontScale <= READER_FONT_SCALE.min}
            accessibilityLabel={UI_LABELS.actions.decreaseFont}
          >
            <Text variant="caption">A</Text>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onPress={() => {
              tapFeedback();
              setFontScale((s) =>
                Math.min(
                  READER_FONT_SCALE.max,
                  Number((s + READER_FONT_SCALE.step).toFixed(2)),
                ),
              );
            }}
            disabled={fontScale >= READER_FONT_SCALE.max}
            accessibilityLabel={UI_LABELS.actions.increaseFont}
          >
            <Text variant="body">A</Text>
          </Button>
        </View>
      </View>

      <Sheet
        visible={fontSheetOpen}
        onClose={() => setFontSheetOpen(false)}
        title="Reading font"
      >
        <View>
          {READING_FONTS.map((option, index) => {
            const selected = option.key === fontKey;
            return (
              <Pressable
                key={option.key}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={option.label}
                onPress={() => {
                  setFontKey(option.key);
                  setFontSheetOpen(false);
                }}
                style={({ pressed }) => [
                  styles.fontOption,
                  index > 0 && styles.fontOptionDivider,
                  pressed && styles.fontOptionPressed,
                ]}
              >
                <View style={styles.fontOptionText}>
                  <Text style={{ fontFamily: option.family, fontSize: 20 }}>
                    {option.label}
                  </Text>
                  <Text variant="caption" color="mutedForeground">
                    {option.description}
                  </Text>
                </View>
                {selected ? (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.foreground}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </Sheet>
    </>
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
                        color={colors.foreground}
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
          <ReaderSection
            blocks={item}
            fontScale={fontScale}
            fontFamily={fontFamily}
          />
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
        extraData={`${fontScale}|${fontKey}`}
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

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: c.background,
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
    backgroundColor: c.muted,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: c.foreground,
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
  fontOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  fontOptionDivider: {
    borderTopWidth: BORDER_WIDTH,
    borderColor: c.border,
  },
  fontOptionPressed: {
    opacity: 0.55,
  },
  fontOptionText: {
    flexShrink: 1,
    gap: 2,
  },
  });
