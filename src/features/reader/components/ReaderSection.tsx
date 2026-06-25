import { StyleSheet, View } from "react-native";

import { SPACING, TYPOGRAPHY } from "@/constants/theme";
import { Text } from "@/components/ui/Text";

interface ReaderSectionProps {
  /** The paragraphs that make up this chunk of the book. */
  paragraphs: string[];
  /** Multiplier applied to the reading type scale (A−/A+ control). */
  fontScale: number;
}

/**
 * One virtualized chunk of the book — a contiguous run of paragraphs. Rendered
 * as a single `FlatList` row so off-screen sections can be recycled. Paragraph
 * spacing is uniform across section boundaries, so the scroll reads as one
 * continuous column with no visible seams.
 */
export function ReaderSection({ paragraphs, fontScale }: ReaderSectionProps) {
  const scaled = {
    fontSize: TYPOGRAPHY.reading.fontSize * fontScale,
    lineHeight: TYPOGRAPHY.reading.lineHeight * fontScale,
  };

  return (
    <View>
      {paragraphs.map((paragraph, index) => (
        <Text
          key={index}
          variant="reading"
          selectable
          style={[styles.paragraph, scaled]}
        >
          {paragraph}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    textAlign: "justify",
    marginBottom: SPACING.md,
  },
});
