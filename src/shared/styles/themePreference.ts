import { useState } from 'react'

export type ThemeMode = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'ai-delivery-lab-theme'

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readThemePreference(): ThemeMode {
  try {
    return getStorage()?.getItem(THEME_STORAGE_KEY) === 'light'
      ? 'light'
      : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyThemePreference(mode: ThemeMode): void {
  document.documentElement.dataset.theme = mode
}

export function saveThemePreference(mode: ThemeMode): void {
  try {
    getStorage()?.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // A blocked localStorage should not prevent theme switching for this visit.
  }
}

export function useThemePreference() {
  const [mode, setMode] = useState<ThemeMode>(readThemePreference)

  const toggle = () => {
    const nextMode: ThemeMode = mode === 'dark' ? 'light' : 'dark'
    setMode(nextMode)
    applyThemePreference(nextMode)
    saveThemePreference(nextMode)
  }

  return { mode, toggle }
}
