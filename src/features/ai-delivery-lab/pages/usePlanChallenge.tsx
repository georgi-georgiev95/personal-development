import { useState } from 'react'
import { FieldError } from '@/features/ai-delivery-lab/pages/TaskWorkspace.styles'
import { PlanChallenge } from '@/features/ai-delivery-lab/pages/PlanChallenge'

const localEmulator = import.meta.env.DEV && import.meta.env.MODE === 'emulator'
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

export function usePlanChallenge(enabled: boolean) {
  const [token, setToken] = useState<string | undefined>(() =>
    enabled && localEmulator ? `local-${crypto.randomUUID()}` : undefined
  )
  const [attempt, setAttempt] = useState(0)
  const missingSiteKey = enabled && import.meta.env.PROD && !siteKey

  return {
    token,
    waiting:
      enabled &&
      (missingSiteKey || ((localEmulator || Boolean(siteKey)) && !token)),
    widget: missingSiteKey ? (
      <FieldError role="alert">
        AI verification is temporarily unavailable.
      </FieldError>
    ) : enabled && siteKey && !localEmulator ? (
      <PlanChallenge key={attempt} siteKey={siteKey} onToken={setToken} />
    ) : null,
    reset: () => {
      setToken(
        enabled && localEmulator ? `local-${crypto.randomUUID()}` : undefined
      )
      setAttempt((value) => value + 1)
    },
  }
}
