import { Text as RNText, type TextProps as RNTextProps } from "react-native"

import {
  FONTS,
  TYPOGRAPHY,
  type ColorToken,
  type TypographyVariant,
} from "@/constants/theme"
import { useTheme } from "@/theme"

export interface TextProps extends RNTextProps {
  /** Typography preset (size, leading, family, tracking). Defaults to `body`. */
  variant?: TypographyVariant
  /** Semantic colour token. Defaults to `foreground`. */
  color?: ColorToken
  /** Render in italic — swaps serif variants to the true italic face. */
  italic?: boolean
  align?: "auto" | "left" | "center" | "right"
}

/**
 * The single text primitive for the app. Encapsulates the type scale and
 * palette so screens never hardcode font families, sizes, tracking or colours —
 * mirroring the web's semantic typography tokens.
 */
export function Text({
  variant = "body",
  color = "foreground",
  italic = false,
  align,
  style,
  ...props
}: TextProps) {
  const { colors } = useTheme()
  const preset = TYPOGRAPHY[variant]
  const isSerif = preset.fontFamily.startsWith("EBGaramond")

  return (
    <RNText
      style={[
        preset,
        italic && isSerif ? { fontFamily: FONTS.serifItalic } : null,
        italic && !isSerif ? { fontStyle: "italic" } : null,
        { color: colors[color] },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...props}
    />
  )
}
