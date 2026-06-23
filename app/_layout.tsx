import { useEffect, useState } from "react";
import {
  EBGaramond_400Regular,
  EBGaramond_400Regular_Italic,
  EBGaramond_500Medium,
  EBGaramond_600SemiBold,
  EBGaramond_700Bold,
  EBGaramond_800ExtraBold_Italic,
} from "@expo-google-fonts/eb-garamond";
import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Pressable } from "react-native";

import { COLORS, FONTS } from "@/constants/theme";
import { UI_LABELS } from "@/constants/ui-labels";
import { AppProviders } from "@/providers/AppProviders";
import { AnimatedSplash } from "@/components/splash/AnimatedSplash";
import { ToastHost } from "@/components/feedback/toast/ToastHost";
import { useLibraryStore } from "@/features/library/stores/saved-books-store";
import { OnboardingScreen } from "@/features/onboarding/screens/OnboardingScreen";

// Keep the native splash up until our fonts are ready, then hand off to the
// animated splash so there's no flash between the two.
void SplashScreen.preventAutoHideAsync();

/** Close (✕) affordance for modal screens (book detail, browse). */
function ModalCloseButton() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={UI_LABELS.actions.back}
      onPress={() => router.back()}
      hitSlop={10}
    >
      <Ionicons name="close" size={24} color={COLORS.foreground} />
    </Pressable>
  );
}

/** Max time to wait on store hydration before revealing the app regardless. */
const HYDRATION_FALLBACK_MS = 2500;

/** Minimum time the splash stays on screen, for a deliberate ~3s reveal. */
const SPLASH_MIN_MS = 3000;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_600SemiBold,
    EBGaramond_700Bold,
    EBGaramond_400Regular_Italic,
    EBGaramond_800ExtraBold_Italic,
  });

  const hydrated = useLibraryStore((state) => state.hasHydrated);
  const [splashDone, setSplashDone] = useState(false);
  // Onboarding is shown on every launch (not persisted), per product choice.
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [hydrationTimedOut, setHydrationTimedOut] = useState(false);
  const [minSplashElapsed, setMinSplashElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setHydrationTimedOut(true),
      HYDRATION_FALLBACK_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMinSplashElapsed(true), SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Hold on the native splash until the custom fonts are available.
  if (!fontsLoaded) return null;

  // Hold the splash until the app is ready AND the minimum ~3s has elapsed.
  const appReady =
    fontsLoaded && (hydrated || hydrationTimedOut) && minSplashElapsed;

  // Show onboarding every launch, once the splash has handed off.
  const showOnboarding = splashDone && !onboardingDone;

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: COLORS.background },
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.foreground,
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: FONTS.serifSemiBold },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="browse"
          options={{
            presentation: "modal",
            title: "Browse",
            headerLeft: () => <ModalCloseButton />,
          }}
        />
        <Stack.Screen
          name="book/[id]"
          options={{
            presentation: "modal",
            title: "",
            headerLeft: () => <ModalCloseButton />,
          }}
        />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>

      <ToastHost />

      {showOnboarding ? (
        <OnboardingScreen onContinue={() => setOnboardingDone(true)} />
      ) : null}

      {!splashDone ? (
        <AnimatedSplash ready={appReady} onFinish={() => setSplashDone(true)} />
      ) : null}
    </AppProviders>
  );
}
