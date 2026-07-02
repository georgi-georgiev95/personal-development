import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type ChangeListener = (event: { matches: boolean }) => void

const createMatchMedia = (initialMatches: boolean) => {
  const listeners: ChangeListener[] = []
  const mediaQueryList = {
    matches: initialMatches,
    addEventListener: vi.fn((_: string, listener: ChangeListener) => {
      listeners.push(listener)
    }),
    removeEventListener: vi.fn((_: string, listener: ChangeListener) => {
      const index = listeners.indexOf(listener)
      if (index >= 0) listeners.splice(index, 1)
    }),
  }
  const matchMedia = vi.fn(() => mediaQueryList)
  return { matchMedia, mediaQueryList, listeners }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('usePrefersReducedMotion', () => {
  it('returns false when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })

  it('reflects the initial media query state', () => {
    const { matchMedia } = createMatchMedia(true)
    vi.stubGlobal('matchMedia', matchMedia)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('updates when the media query changes', () => {
    const { matchMedia, listeners } = createMatchMedia(false)
    vi.stubGlobal('matchMedia', matchMedia)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)

    act(() => {
      listeners.forEach((listener) => listener({ matches: true }))
    })
    expect(result.current).toBe(true)
  })

  it('removes the change listener on unmount', () => {
    const { matchMedia, mediaQueryList } = createMatchMedia(false)
    vi.stubGlobal('matchMedia', matchMedia)
    const { unmount } = renderHook(() => usePrefersReducedMotion())
    unmount()
    expect(mediaQueryList.removeEventListener).toHaveBeenCalled()
  })
})
