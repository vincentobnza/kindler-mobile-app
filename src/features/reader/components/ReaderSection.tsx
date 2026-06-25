import { StyleSheet, View } from "react-native";

import { SPACING, TYPOGRAPHY } from "@/constants/theme";
import { Text } from "@/components/ui/Text";

import type { BookBlock } from "../types";

interface ReaderSectionProps {
  /** The blocks that make up this chunk of the book. */
  blocks: BookBlock[];
  /** Multiplier applied to the reading type scale (A-/A+ control). */
  fontScale: number;
  /** Font family for the running prose, chosen from the reader's font sheet. */
  fontFamily: string;
}

// Asterism (U+2042), by code point, used as the scene-break ornament.
const ASTERISM = String.fromCharCode(0x2042);

/**
 * One virtualized chunk of the book - a contiguous run of blocks. Rendered as a
 * single `FlatList` row so off-screen sections can be recycled. Chapter
 * headings are set apart with an optional small-caps kicker, scene breaks show
 * as a centered ornament, and prose flows as justified paragraphs, so the
 * scroll reads as one continuous book column with no visible seams.
 */
export function ReaderSection({
  blocks,
  fontScale,
  fontFamily,
}: ReaderSectionProps) {
  const prose = {
    fontFamily,
    fontSize: TYPOGRAPHY.reading.fontSize * fontScale,
    lineHeight: TYPOGRAPHY.reading.lineHeight * fontScale,
  };

  return (
    <View>
      {blocks.map((block, index) => {
        if (block.kind === "break") {
          return (
            <Text
              key={index}
              variant="h3"
              align="center"
              color="mutedForeground"
              style={styles.break}
            >
              {ASTERISM}
            </Text>
          );
        }

        if (block.kind === "heading") {
          return (
            <View key={index} style={styles.heading}>
              {block.kicker ? (
                <Text
                  variant="caption"
                  align="center"
                  color="mutedForeground"
                  style={styles.kicker}
                >
                  {block.kicker.toUpperCase()}
                </Text>
              ) : null}
              <Text variant="h2" align="center">
                {block.title}
              </Text>
            </View>
          );
        }

        return (
          <Text
            key={index}
            variant="reading"
            selectable
            style={[styles.paragraph, prose]}
          >
            {block.text}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    textAlign: "justify",
    marginBottom: SPACING.md,
  },
  heading: {
    marginTop: SPACING["2xl"],
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  kicker: {
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  break: {
    // Colour comes from the themed `color="mutedForeground"` prop on <Text>.
    marginVertical: SPACING.lg,
    letterSpacing: 6,
  },
});
