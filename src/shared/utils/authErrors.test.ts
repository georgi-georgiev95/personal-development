import { describe, it, expect } from 'vitest'
import { getAuthErrorMessage } from './authErrors'

describe('getAuthErrorMessage', () => {
  it('returns mapped message for known error codes', () => {
    expect(getAuthErrorMessage({ code: 'auth/user-not-found' })).toBe(
      'No account found with this email address'
    )

    expect(getAuthErrorMessage({ code: 'auth/wrong-password' })).toBe(
      'Incorrect password'
    )

    expect(getAuthErrorMessage({ code: 'auth/email-already-in-use' })).toBe(
      'An account with this email already exists'
    )
  })

  it('falls back to Error message when code is present but unknown', () => {
    const err = new Error('Fallback') as Error & { code: string }
    err.code = 'auth/unknown-code'
    expect(getAuthErrorMessage(err)).toBe('Fallback')
  })

  it('falls back to Error message for Error without code', () => {
    expect(getAuthErrorMessage(new Error('Something went wrong'))).toBe(
      'Something went wrong'
    )
  })

  it('returns default message for unrecognizable input', () => {
    expect(getAuthErrorMessage('random-string')).toBe(
      'An unexpected error occurred. Please try again.'
    )
    expect(getAuthErrorMessage(null)).toBe(
      'An unexpected error occurred. Please try again.'
    )
    expect(getAuthErrorMessage(42)).toBe(
      'An unexpected error occurred. Please try again.'
    )
  })
})
