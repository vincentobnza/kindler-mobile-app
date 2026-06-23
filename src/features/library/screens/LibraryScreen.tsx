import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Alert, StyleSheet, View } from "react-native"

import { STATE_IMAGES } from "@/constants/assets"
import { buildPath } from "@/constants/routes"
import { COLORS, LAYOUT, SPACING } from "@/constants/theme"
import { UI_LABELS } from "@/constants/ui-labels"
import { PageHeader } from "@/components/common/PageHeader"
import { Screen } from "@/components/common/Screen"
import { EmptyState } from "@/components/feedback/EmptyState"
import { StateImage } from "@/components/feedback/StateImage"
import { Button } from "@/components/ui/Button"
import { BookGrid } from "@/features/books/components/BookGrid"

import { useLibrary } from "../hooks/useLibrary"

/** Library — books saved to read later, persisted on-device. */
export function LibraryScreen() {
  const { list, count, clear } = useLibrary()

  const description =
    count > 0
      ? `${count} saved book${count === 1 ? "" : "s"}, kept on this device.`
      : "Books you save are kept locally on this device."

  function confirmClear() {
    Alert.alert("Clear library?", "This removes every saved book.", [
      { text: UI_LABELS.actions.back, style: "cancel" },
      { text: UI_LABELS.actions.clearAll, style: "destructive", onPress: clear },
    ])
  }

  const header = (
    <View style={styles.header}>
      <PageHeader
        title="My library"
        description={description}
        actions={
          count > 0 ? (
            <Button
              variant="destructive"
              size="sm"
              label={UI_LABELS.actions.clearAll}
              onPress={confirmClear}
              leftIcon={
                <Ionicons name="trash-outline" size={15} color={COLORS.destructive} />
              }
            />
          ) : undefined
        }
      />
    </View>
  )

  if (count === 0) {
    return (
      <Screen animateOnFocus>
        <View style={styles.headerStandalone}>{header}</View>
        <View style={styles.fill}>
          <EmptyState
            illustration={<StateImage source={STATE_IMAGES.bookmarkEmpty} />}
            title="No saved books yet"
            description={UI_LABELS.feedback.emptyLibrary}
            action={
              <Button
                variant="outline"
                size="sm"
                label={UI_LABELS.actions.browseBooks}
                onPress={() => router.navigate(buildPath.browse())}
              />
            }
          />
        </View>
      </Screen>
    )
  }

  return (
    <Screen animateOnFocus>
      <BookGrid books={list} ListHeaderComponent={header} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: SPACING.lg,
  },
  headerStandalone: {
    paddingHorizontal: LAYOUT.screenPaddingX,
    paddingTop: SPACING.lg,
  },
  fill: {
    flex: 1,
  },
})
