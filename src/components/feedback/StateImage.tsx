import { Image, type ImageSource } from "expo-image"

interface StateImageProps {
  source: ImageSource | number
  /** Square render size in points. */
  size?: number
}

/** Renders a square illustration for empty/error states (contain-fit). */
export function StateImage({ source, size = 150 }: StateImageProps) {
  return (
    <Image
      source={source}
      style={{ width: size, height: size }}
      contentFit="contain"
      transition={200}
      accessible={false}
    />
  )
}
