import { useEffect } from "react";
import { AccessibilityInfo, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { SITE } from "@/constants/site";
import { FONTS, SPACING, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/theme";

interface AnimatedSplashProps {
  /** Called once the exit animation has fully played out. */
  onFinish: () => void;
  /** Hold the splash until the app is ready (fonts + store hydration). */
  ready: boolean;
}

const EASE_OUT = Easing.out(Easing.cubic);
const RULE_WIDTH = 64;
// Duration is controlled by the root layout's ~3s gate; exit as soon as ready.
const HOLD_MS = 0;

/**
 * Premium animated splash. The wordmark reveals with a fade + scale + rise, a
 * hairline rule draws outward, the tagline settles in, then the whole scene
 * fades up and away to hand off to the app. Honours "reduce motion".
 */
export function AnimatedSplash({ onFinish, ready }: AnimatedSplashProps) {
  const styles = useThemedStyles(makeStyles);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.92);
  const logoY = useSharedValue(10);
  const ruleScale = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(8);
  const loaderOpacity = useSharedValue(0);

  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  // Entrance — runs once on mount.
  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) {
        logoOpacity.value = withTiming(1, { duration: 200 });
        logoScale.value = 1;
        logoY.value = 0;
        ruleScale.value = 1;
        taglineOpacity.value = withTiming(1, { duration: 200 });
        taglineY.value = 0;
        loaderOpacity.value = withTiming(1, { duration: 200 });
        return;
      }
      logoOpacity.value = withTiming(1, { duration: 600, easing: EASE_OUT });
      logoScale.value = withTiming(1, { duration: 600, easing: EASE_OUT });
      logoY.value = withTiming(0, { duration: 600, easing: EASE_OUT });
      ruleScale.value = withDelay(
        380,
        withTiming(1, { duration: 520, easing: EASE_OUT }),
      );
      taglineOpacity.value = withDelay(320, withTiming(1, { duration: 520 }));
      taglineY.value = withDelay(
        320,
        withTiming(0, { duration: 520, easing: EASE_OUT }),
      );
      loaderOpacity.value = withDelay(620, withTiming(1, { duration: 420 }));
    });
    return () => {
      cancelled = true;
    };
  }, [
    logoOpacity,
    logoScale,
    logoY,
    ruleScale,
    taglineOpacity,
    taglineY,
    loaderOpacity,
  ]);

  // Exit — plays once the app reports ready.
  useEffect(() => {
    if (!ready) return;
    containerOpacity.value = withDelay(
      HOLD_MS,
      withTiming(
        0,
        { duration: 460, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(onFinish)();
        },
      ),
    );
    containerScale.value = withDelay(
      HOLD_MS,
      withTiming(1.04, { duration: 460, easing: Easing.in(Easing.cubic) }),
    );
  }, [ready, containerOpacity, containerScale, onFinish]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { translateY: logoY.value }],
  }));

  return (
    <Animated.View style={[styles.fill, containerStyle]} pointerEvents="none">
      <View style={styles.center}>
        <Animated.Text style={[styles.wordmark, logoStyle]}>
          {SITE.name}.
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    fill: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: c.background,
      alignItems: "center",
      justifyContent: "center",
    },
    center: {
      alignItems: "center",
      gap: SPACING.lg,
    },
    wordmark: {
      fontFamily: FONTS.serifExtraBoldItalic,
      fontSize: 52,
      lineHeight: 60,
      letterSpacing: -1,
      color: c.brand,
    },
    rule: {
      width: RULE_WIDTH,
      height: 2,
      backgroundColor: c.foreground,
    },
    loader: {
      position: "absolute",
      bottom: SPACING["5xl"],
    },
  });
