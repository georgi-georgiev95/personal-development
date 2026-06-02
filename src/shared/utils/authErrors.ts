const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': 'No account found with this email address',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-credential': 'Invalid email or password',
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/weak-password': 'Password must be at least 6 characters',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Please check your connection',
  'auth/popup-closed-by-user': 'Sign-in popup was closed before completing',
}

export function getAuthErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code
    if (code in AUTH_ERROR_MESSAGES) {
      return AUTH_ERROR_MESSAGES[code]
    }
  }
  if (err instanceof Error) {
    return err.message
  }
  return 'An unexpected error occurred. Please try again.'
}
