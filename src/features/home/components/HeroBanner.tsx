import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { buildPath } from "@/constants/routes";
import { SITE } from "@/constants/site";
import {
  BORDER_WIDTH,
  FONTS,
  LAYOUT,
  RADIUS,
  SPACING,
  withAlpha,
  type ThemeColors,
} from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/theme";
import { UI_LABELS } from "@/constants/ui-labels";
import { useTypewriter } from "@/lib/hooks/useTypewriter";
import { splitOnce } from "@/lib/format/text";
import { Text } from "@/components/ui/Text";

/** Example searches the placeholder cycles through. */
const PLACEHOLDER_PHRASES = [
  "Dune",
  "Pride and Prejudice",
  "The Hobbit",
  "Ursula K. Le Guin",
  "mystery novels",
  "poetry",
] as const;

const STAGGER = 90;

/** Animated Discover hero. The search bar opens the Browse modal on tap. */
export function HeroBanner() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const typed = useTypewriter(PLACEHOLDER_PHRASES);
  const tagline = splitOnce(SITE.tagline, SITE.taglineEmphasis);

  function openBrowse() {
    router.navigate(buildPath.browse());
  }

  return (
    <View style={styles.section}>
      <Animated.View entering={FadeInDown.duration(500)}>
        <View style={styles.badge}>
          <Text variant="caption" color="mutedForeground">
            Powered by the Open Library
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(550).delay(STAGGER)}>
        <Text variant="display" align="center">
          {tagline.before}
          <Text variant="display" italic>
            {tagline.match}
          </Text>
          {tagline.after}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(550).delay(STAGGER * 2)}>
        <Text
          variant="body"
          color="mutedForeground"
          align="center"
          style={styles.description}
        >
          {SITE.description}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(550).delay(STAGGER * 3)}
        style={styles.searchWrap}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={UI_LABELS.actions.search}
          onPress={openBrowse}
          style={({ pressed }) => [styles.searchBar, pressed && styles.pressed]}
        >
          <Text
            style={styles.placeholder}
            color="mutedForeground"
            numberOfLines={1}
          >
            Search “{typed}”
          </Text>
          <View style={styles.submit}>
            <Ionicons
              name="search"
              size={18}
              color={colors.primaryForeground}
            />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    section: {
      alignItems: "center",
      gap: SPACING.xl,
      paddingVertical: SPACING["4xl"],
      paddingHorizontal: LAYOUT.screenPaddingX,
    },
    badge: {
      alignSelf: "center",
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH,
      borderColor: c.border,
      backgroundColor: withAlpha(c.background, 0.6),
    },
    description: {
      maxWidth: 420,
    },
    searchWrap: {
      width: "100%",
      maxWidth: 480,
      marginTop: SPACING.xs,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 56,
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xs,
      borderRadius: RADIUS.full,
      borderWidth: BORDER_WIDTH,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    pressed: {
      backgroundColor: c.accent,
    },
    placeholder: {
      flex: 1,
      fontFamily: FONTS.serif,
      fontSize: 17,
      letterSpacing: 0,
    },
    submit: {
      width: 44,
      height: 44,
      borderRadius: RADIUS.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.primary,
    },
  });
