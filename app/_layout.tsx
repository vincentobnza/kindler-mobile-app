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
import { useLibraryStore } from "@/features/library/stores/saved-books-store";

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
  const [hydrationTimedOut, setHydrationTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setHydrationTimedOut(true),
      HYDRATION_FALLBACK_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Hold on the native splash until the custom fonts are available.
  if (!fontsLoaded) return null;

  const appReady = fontsLoaded && (hydrated || hydrationTimedOut);

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

      {!splashDone ? (
        <AnimatedSplash ready={appReady} onFinish={() => setSplashDone(true)} />
      ) : null}
    </AppProviders>
  );
}
