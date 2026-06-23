/** Declarative navigation model shared by the bottom tab bar. */

import type { ComponentProps } from "react"
import type { Ionicons } from "@expo/vector-icons"

import { ROUTE_PATHS } from "@/constants/routes"

type IoniconName = ComponentProps<typeof Ionicons>["name"]

export interface NavItem {
  /** expo-router tab screen name (file basename inside `app/(tabs)`). */
  name: string
  label: string
  route: string
  icon: IoniconName
  activeIcon: IoniconName
}

export const PRIMARY_NAV: readonly NavItem[] = [
  {
    name: "index",
    label: "Discover",
    route: ROUTE_PATHS.home,
    icon: "compass-outline",
    activeIcon: "compass",
  },
  {
    name: "library",
    label: "Library",
    route: ROUTE_PATHS.library,
    icon: "bookmark-outline",
    activeIcon: "bookmark",
  },
] as const
