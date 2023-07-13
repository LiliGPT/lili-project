import type { EffectCallback } from "react"
import { useEffect, useRef } from "react"

export function useComponentDidMount(effect: EffectCallback | (() => Promise<void>)) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      effect()
    }
  }, []);
}
