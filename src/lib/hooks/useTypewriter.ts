import { useEffect, useState } from "react"

interface TypewriterOptions {
  /** Pause typing/erasing (e.g. while the field has a value). */
  active?: boolean
  typeMs?: number
  deleteMs?: number
  holdMs?: number
}

/**
 * Cycles through `phrases` with a type-then-erase effect, returning the text to
 * render right now. Pure timer-driven (no external deps); pauses when inactive.
 */
export function useTypewriter(
  phrases: readonly string[],
  { active = true, typeMs = 90, deleteMs = 40, holdMs = 1500 }: TypewriterOptions = {}
): string {
  const [display, setDisplay] = useState("")

  useEffect(() => {
    if (!active || phrases.length === 0) return

    let phraseIndex = 0
    let charIndex = 0
    let erasing = false
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      const phrase = phrases[phraseIndex]
      if (!erasing) {
        charIndex += 1
        setDisplay(phrase.slice(0, charIndex))
        if (charIndex === phrase.length) {
          erasing = true
          timer = setTimeout(tick, holdMs)
          return
        }
        timer = setTimeout(tick, typeMs)
      } else {
        charIndex -= 1
        setDisplay(phrase.slice(0, charIndex))
        if (charIndex === 0) {
          erasing = false
          phraseIndex = (phraseIndex + 1) % phrases.length
          timer = setTimeout(tick, typeMs)
          return
        }
        timer = setTimeout(tick, deleteMs)
      }
    }

    timer = setTimeout(tick, typeMs)
    return () => clearTimeout(timer)
  }, [phrases, active, typeMs, deleteMs, holdMs])

  return active ? display : ""
}
