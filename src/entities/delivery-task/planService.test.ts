import { afterEach, describe, expect, it, vi } from 'vitest'

const { connectFunctionsEmulator, getFunctions, httpsCallable } = vi.hoisted(
  () => ({
    connectFunctionsEmulator: vi.fn(),
    getFunctions: vi.fn(() => 'functions-instance'),
    httpsCallable: vi.fn(() =>
      vi.fn(async () => ({ data: { objective: 'Draft' } }))
    ),
  })
)

vi.mock('firebase/functions', () => ({
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
}))
vi.mock('@/shared/config/firebase/firebase', () => ({ app: 'firebase-app' }))

describe('generateDeliveryPlan', () => {
  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('calls the regional callable and returns its draft', async () => {
    const request = {
      taskId: 'task-1',
      contextEntryIds: ['context-1'],
      contextRevision: 2,
    }
    const { generateDeliveryPlan } = await import('./planService')

    await expect(generateDeliveryPlan(request)).resolves.toEqual({
      objective: 'Draft',
    })
    expect(getFunctions).toHaveBeenCalledWith('firebase-app', 'europe-west1')
    expect(httpsCallable).toHaveBeenCalledWith(
      'functions-instance',
      'generatePlan'
    )
    expect(connectFunctionsEmulator).not.toHaveBeenCalled()
  })

  it('connects to the Functions emulator in emulator development mode', async () => {
    vi.stubEnv('MODE', 'emulator')
    vi.stubEnv('DEV', true)
    const { generateDeliveryPlan } = await import('./planService')

    await generateDeliveryPlan({
      taskId: 'task-1',
      contextEntryIds: [],
      contextRevision: 0,
    })

    expect(connectFunctionsEmulator).toHaveBeenCalledWith(
      'functions-instance',
      '127.0.0.1',
      5001
    )
  })
})
