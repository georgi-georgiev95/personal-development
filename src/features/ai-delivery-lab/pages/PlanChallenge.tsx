import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/ui-kit'
import { FieldError } from '@/features/ai-delivery-lab/pages/TaskWorkspace.styles'

interface Turnstile {
  render(
    container: HTMLElement,
    options: {
      sitekey: string
      action: string
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
    }
  ): string
  remove(id: string): void
}

let loading: Promise<Turnstile> | undefined

function loadTurnstile(): Promise<Turnstile> {
  const turnstile = (window as Window & { turnstile?: Turnstile }).turnstile
  if (turnstile) return Promise.resolve(turnstile)

  loading ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement('script')
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = () => {
      const api = (window as Window & { turnstile?: Turnstile }).turnstile
      if (api) resolve(api)
      else reject(new Error('Verification did not load.'))
    }
    script.onerror = () => {
      script.remove()
      reject(new Error('Verification did not load.'))
    }
    document.head.append(script)
  }).catch((error: unknown) => {
    loading = undefined
    throw error
  })
  return loading
}

export function PlanChallenge({
  siteKey,
  onToken,
}: {
  siteKey: string
  onToken: (token: string | undefined) => void
}) {
  const container = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    let dispose: (() => void) | undefined
    const showError = () => {
      onToken(undefined)
      setFailed(true)
    }
    void loadTurnstile()
      .then((api) => {
        if (!active || !container.current) return
        const id = api.render(container.current, {
          sitekey: siteKey,
          action: 'generate-plan',
          callback: (token) => {
            if (active) {
              setFailed(false)
              onToken(token)
            }
          },
          'expired-callback': () => {
            if (active) onToken(undefined)
          },
          'error-callback': () => {
            if (active) showError()
          },
        })
        dispose = () => api.remove(id)
      })
      .catch(() => {
        if (active) showError()
      })
    return () => {
      active = false
      dispose?.()
    }
  }, [attempt, onToken, siteKey])

  return (
    <div>
      <div ref={container} />
      {failed && (
        <>
          <FieldError role="alert">Verification could not load.</FieldError>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFailed(false)
              setAttempt((value) => value + 1)
            }}
          >
            Retry verification
          </Button>
        </>
      )}
    </div>
  )
}
