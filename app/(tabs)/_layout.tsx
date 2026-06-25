import { Ionicons } from "@expo/vector-icons";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { PRIMARY_NAV } from "@/constants/navigation";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/theme";

/** Haptic-on-press tab button for a more tactile, native feel. */
function HapticTab(props: React.ComponentProps<typeof PlatformPressable>) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(event) => {
        if (Platform.OS === "ios") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(event);
      }}
    />
  );
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.foreground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,
          paddingHorizontal: 42,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.sansMedium,
          fontSize: 11,
        },
      }}
    >
      {PRIMARY_NAV.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.label,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? item.activeIcon : item.icon}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
