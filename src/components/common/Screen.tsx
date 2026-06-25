import type { ReactNode } from "react"
import { StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { LAYOUT, type ThemeColors } from "@/constants/theme"
import { useThemedStyles } from "@/theme"
import { TopBar } from "@/layout/components/TopBar"

import { SlideUpOnFocus } from "./SlideUpOnFocus"

interface ScreenProps {
  children: ReactNode
  /** Show the wordmark top bar (the persistent chrome). Defaults to true. */
  showTopBar?: boolean
  /** Replay a modal-style slide-up entrance each time the screen is focused. */
  animateOnFocus?: boolean
}

/**
 * The persistent screen chrome wrapping every route: warm-paper background,
 * safe-area top inset, the wordmark `TopBar`, and a content column capped for
 * tablets (the web's `max-w-5xl` Container). Children manage their own
 * scrolling and horizontal padding.
 */
export function Screen({
  children,
  showTopBar = true,
  animateOnFocus = false,
}: ScreenProps) {
  const insets = useSafeAreaInsets()
  const styles = useThemedStyles(makeStyles)

  const body = (
    <>
      {showTopBar ? <TopBar /> : null}
      <View style={styles.content}>{children}</View>
    </>
  )

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {animateOnFocus ? (
        <SlideUpOnFocus style={styles.flex}>{body}</SlideUpOnFocus>
      ) : (
        body
      )}
    </View>
  )
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: c.background,
    },
    flex: {
      flex: 1,
    },
    content: {
      flex: 1,
      width: "100%",
      maxWidth: LAYOUT.maxContentWidth,
      alignSelf: "center",
    },
  })
