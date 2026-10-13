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
      'Could not generate a plan right now.'
    )
  })
})
