import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  applyThemePreference,
  readThemePreference,
  saveThemePreference,
  THEME_STORAGE_KEY,
} from './themePreference'

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('theme preference', () => {
  it('defaults to dark and reads an explicit light preference', () => {
    expect(readThemePreference()).toBe('dark')
    localStorage.setItem(THEME_STORAGE_KEY, 'light')
    expect(readThemePreference()).toBe('light')
  })

  it('falls back to dark when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })
    expect(readThemePreference()).toBe('dark')
  })

  it('applies and persists the selected mode', () => {
    applyThemePreference('light')
    saveThemePreference('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('keeps the app usable when saving is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })
    expect(() => saveThemePreference('light')).not.toThrow()
  })
})
