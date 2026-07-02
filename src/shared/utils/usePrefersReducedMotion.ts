import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const getInitialValue = (): boolean =>
  typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches

/**
 * Tracks the user's `prefers-reduced-motion` setting, updating live when it
 * changes. Consumers should disable auto-playing animation when it is true.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(getInitialValue)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(QUERY)
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
