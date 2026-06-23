import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { SITE } from "@/constants/site";
import {
  BORDER_WIDTH,
  BRAND_INK,
  COLORS,
  LAYOUT,
  RADIUS,
  SPACING,
  withAlpha,
} from "@/constants/theme";
import { UI_LABELS } from "@/constants/ui-labels";
import { bookCoverUrl } from "@/lib/format/book";
import { splitOnce } from "@/lib/format/text";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { subjectQueryOptions } from "@/features/books/queries/book-queries";

import { BookMarquee } from "../components/BookMarquee";

/**
 * Onboarding is a deliberate **pure-black** exception to the otherwise light
 * app — a dramatic full-bleed book wall over black, with a white CTA.
 */
const DARK_BG = BRAND_INK;
const DARK_TEXT = COLORS.background;
const CTA_BG = "#FFFFFF";

/** First-launch onboarding: an askew book wall, a hero, and a Continue CTA. */
export function OnboardingScreen({ onContinue }: { onContinue: () => void }) {
  const insets = useSafeAreaInsets();
  const { data } = useQuery(subjectQueryOptions("fiction", 24));
  const tagline = splitOnce(SITE.tagline, SITE.taglineEmphasis);

  const coverUrls = useMemo(
    () =>
      (data ?? [])
        .map((book) =>
          bookCoverUrl(
            { coverId: book.coverId, coverEdition: book.coverEdition },
            "M",
          ),
        )
        .filter((url): url is string => Boolean(url)),
    [data],
  );

  const rootOpacity = useSharedValue(1);
  const rootStyle = useAnimatedStyle(() => ({ opacity: rootOpacity.value }));

  function handleContinue() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    rootOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) runOnJS(onContinue)();
    });
  }

  return (
    <Animated.View style={[styles.root, rootStyle]}>
      <StatusBar style="light" />

      <View
        style={[styles.wallWrap, { paddingTop: insets.top + SPACING.lg }]}
        pointerEvents="none"
      >
        <BookMarquee coverUrls={coverUrls} />
      </View>

      <LinearGradient
        colors={[withAlpha(DARK_BG, 0), withAlpha(DARK_BG, 0.85), DARK_BG]}
        locations={[0, 0.5, 0.74]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View
        style={[styles.hero, { paddingBottom: insets.bottom + SPACING["2xl"] }]}
      >
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.heroText}
        >
          <View style={styles.badge}>
            <Text variant="caption" style={styles.badgeText}>
              Powered by the Open Library
            </Text>
          </View>
          <Text variant="display" align="center" color="background">
            {tagline.before}
            <Text variant="display" italic color="background">
              {tagline.match}
            </Text>
            {tagline.after}
          </Text>
          <Text variant="body" align="center" style={styles.subtitle}>
            {UI_LABELS.onboarding.subtitle}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(140)}
          style={styles.actions}
        >
          <Button
            variant="secondary"
            label={UI_LABELS.onboarding.continue}
            size="lg"
            fullWidth
            onPress={handleContinue}
            style={styles.continue}
            rightIcon={
              <Ionicons
                name="arrow-forward"
                size={18}
                color={COLORS.foreground}
              />
            }
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: DARK_BG,
  },
  wallWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  hero: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    gap: SPACING.xl,
    paddingHorizontal: LAYOUT.screenPaddingX,
  },
  heroText: {
    alignItems: "center",
    gap: SPACING.md,
    maxWidth: 480,
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: BORDER_WIDTH,
    borderColor: withAlpha(DARK_TEXT, 0.1),
    backgroundColor: withAlpha(DARK_TEXT, 0.08),
  },
  badgeText: {
    color: withAlpha(DARK_TEXT, 0.8),
  },
  subtitle: {
    maxWidth: 420,
    color: withAlpha(DARK_TEXT, 0.7),
  },
  actions: {
    width: "100%",
    maxWidth: 480,
  },
  continue: {
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: CTA_BG,
  },
});
