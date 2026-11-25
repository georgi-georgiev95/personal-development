import { afterEach, describe, expect, it, vi } from 'vitest'

const authState = vi.hoisted(() => ({
  currentUser: null as { getIdToken: () => Promise<string> } | null,
  getIdToken: vi.fn(),
}))

vi.mock('@/shared/config/firebase/auth', () => ({
  auth: authState,
}))

describe('generateDeliveryPlan', () => {
  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    authState.currentUser = null
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('sends the Firebase token to the zero-cost planner Worker', async () => {
    vi.stubEnv('VITE_AI_PLANNER_URL', 'https://planner.example/plan')
    authState.currentUser = { getIdToken: authState.getIdToken }
    authState.getIdToken.mockResolvedValue('firebase-token')
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ draft: { objective: 'Draft' } }), {
            status: 200,
          })
      )
    )
    const request = {
      taskId: 'task-1',
      contextEntryIds: ['context-1'],
      contextRevision: 2,
    }
    const { generateDeliveryPlan } = await import('./planService')

    await expect(generateDeliveryPlan(request)).resolves.toEqual({
      objective: 'Draft',
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://planner.example/plan',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer firebase-token',
        }),
        body: JSON.stringify(request),
      })
    )
  })

  it('uses the local Worker URL in emulator mode', async () => {
    vi.stubEnv('MODE', 'emulator')
    vi.stubEnv('DEV', true)
    authState.currentUser = { getIdToken: authState.getIdToken }
    authState.getIdToken.mockResolvedValue('firebase-token')
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ draft: { objective: 'Draft' } }), {
            status: 200,
          })
      )
    )
    const { generateDeliveryPlan } = await import('./planService')

    await generateDeliveryPlan({
      taskId: 'task-1',
      contextEntryIds: [],
      contextRevision: 0,
    })

    expect(fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8787/plan',
      expect.any(Object)
    )
  })

  it('rejects unauthenticated and unconfigured requests', async () => {
    vi.stubEnv('VITE_AI_PLANNER_URL', '')
    const unauthenticated = await import('./planService')
    await expect(
      unauthenticated.generateDeliveryPlan({
        taskId: 'task-1',
        contextEntryIds: [],
        contextRevision: 0,
      })
    ).rejects.toThrow('Sign in to generate a plan.')

    vi.resetModules()
    authState.currentUser = { getIdToken: authState.getIdToken }
    const unconfigured = await import('./planService')
    await expect(
      unconfigured.generateDeliveryPlan({
        taskId: 'task-1',
        contextEntryIds: [],
        contextRevision: 0,
      })
    ).rejects.toThrow('Planning is not configured.')
  })

  it('surfaces Worker errors and malformed responses', async () => {
    vi.stubEnv('VITE_AI_PLANNER_URL', 'https://planner.example/plan')
    authState.currentUser = { getIdToken: authState.getIdToken }
    authState.getIdToken.mockResolvedValue('firebase-token')
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ error: 'Daily limit reached.' }), {
            status: 429,
          })
        )
        .mockResolvedValueOnce(new Response('not json', { status: 503 }))
        .mockResolvedValueOnce(Response.json({}))
    )
    const { generateDeliveryPlan } = await import('./planService')
    const request = {
      taskId: 'task-1',
      contextEntryIds: [],
      contextRevision: 0,
    }

    await expect(generateDeliveryPlan(request)).rejects.toThrow(
      'Daily limit reached.'
    )
    await expect(generateDeliveryPlan(request)).rejects.toThrow(
      'AI generation is temporarily unavailable. Try again shortly.'
    )
    await expect(generateDeliveryPlan(request)).rejects.toThrow(
      'Could not generate a plan right now.'
    )
  })

  it('sends guest input and verification without a Firebase token', async () => {
    vi.stubEnv('VITE_AI_PLANNER_URL', 'https://planner.example/plan/')
    const send = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ draft: { objective: 'Draft' } }))
      .mockResolvedValueOnce(
        Response.json(
          { error: 'resource-exhausted', resetAt: '2026-11-26T00:00:00.000Z' },
          { status: 429 }
        )
      )
      .mockResolvedValueOnce(
        Response.json({ error: 'resource-exhausted' }, { status: 429 })
      )
      .mockResolvedValueOnce(
        Response.json({ error: 'rate-limited' }, { status: 429 })
      )
      .mockResolvedValueOnce(
        Response.json({ error: 'challenge-required' }, { status: 403 })
      )
    vi.stubGlobal('fetch', send)
    const { generateGuestPlan } = await import('./planService')
    const input = { title: 'Plan meals', goal: 'Plan meals for the week' }
    await expect(generateGuestPlan(input, 'proof')).resolves.toEqual({
      objective: 'Draft',
    })
    expect(send).toHaveBeenCalledWith('https://planner.example/plan/guest', {
      method: 'POST',
      headers: {
        'X-Turnstile-Token': 'proof',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })
    await expect(generateGuestPlan(input)).rejects.toThrow('Try again after')
    await expect(generateGuestPlan(input)).rejects.toThrow('midnight UTC')
    await expect(generateGuestPlan(input)).rejects.toThrow('Too many requests')
    await expect(generateGuestPlan(input)).rejects.toThrow(
      'Complete the verification'
    )
  })
})
