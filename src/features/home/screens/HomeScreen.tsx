import { ScrollView, StyleSheet, View } from "react-native"

import { FEATURE_FLAGS } from "@/constants/feature-flags"
import { SPACING } from "@/constants/theme"
import { Screen } from "@/components/common/Screen"
import { BookShelf } from "@/features/books/components/BookShelf"
import { DISCOVER_SHELVES } from "@/features/books/constants/discover"

import { HeroBanner } from "../components/HeroBanner"

/** Discover — an animated hero plus curated, scrolling subject shelves. */
export function HomeScreen() {
  return (
    <Screen animateOnFocus>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HeroBanner />

        {FEATURE_FLAGS.discoverShelves ? (
          <View style={styles.shelves}>
            {DISCOVER_SHELVES.map((shelf) => (
              <BookShelf key={shelf.subject} shelf={shelf} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: SPACING["4xl"],
  },
  shelves: {
    gap: SPACING["3xl"],
    paddingTop: SPACING.sm,
  },
})
