import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  rateMetric,
  consoleReporter,
  initPerformanceMetrics,
  trackInteraction,
  getMetricsSnapshot,
  clearMetrics,
  type PerformanceMetric,
} from './performanceMetrics'

type ObserverCallback = (list: { getEntries: () => PerformanceEntry[] }) => void

class FakePerformanceObserver {
  static supportedEntryTypes: string[] = [
    'navigation',
    'paint',
    'largest-contentful-paint',
    'layout-shift',
    'event',
  ]

  static instances: FakePerformanceObserver[] = []

  callback: ObserverCallback
  observedType: string | null = null
  observeOptions: PerformanceObserverInit | null = null
  disconnected = false

  constructor(callback: ObserverCallback) {
    this.callback = callback
    FakePerformanceObserver.instances.push(this)
  }

  observe(options: PerformanceObserverInit) {
    this.observedType = (options as { type?: string }).type ?? null
    this.observeOptions = options
  }

  disconnect() {
    this.disconnected = true
  }

  emit(entries: Array<Record<string, unknown>>) {
    this.callback({
      getEntries: () => entries as unknown as PerformanceEntry[],
    })
  }
}

const observerFor = (type: string): FakePerformanceObserver => {
  const found = FakePerformanceObserver.instances.find(
    (instance) => instance.observedType === type
  )
  if (!found) throw new Error(`no observer registered for ${type}`)
  return found
}

describe('rateMetric', () => {
  it('returns good for metrics without thresholds', () => {
    expect(rateMetric('interaction:save', 99999)).toBe('good')
  })

  it('rates values at or below the good boundary as good', () => {
    expect(rateMetric('LCP', 2500)).toBe('good')
  })

  it('rates values between the boundaries as needs-improvement', () => {
    expect(rateMetric('LCP', 3000)).toBe('needs-improvement')
  })

  it('rates values above the upper boundary as poor', () => {
    expect(rateMetric('LCP', 4001)).toBe('poor')
  })
})

describe('consoleReporter', () => {
  it('logs the metric name, value, and rating', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    consoleReporter({
      name: 'LCP',
      value: 1234.5678,
      rating: 'good',
      timestamp: 0,
    })
    expect(debugSpy).toHaveBeenCalledWith('[perf] LCP: 1234.568 (good)')
    debugSpy.mockRestore()
  })
})

describe('initPerformanceMetrics', () => {
  let reported: PerformanceMetric[]
  let reporter: (metric: PerformanceMetric) => void

  beforeEach(() => {
    clearMetrics()
    FakePerformanceObserver.instances = []
    FakePerformanceObserver.supportedEntryTypes = [
      'navigation',
      'paint',
      'largest-contentful-paint',
      'layout-shift',
      'event',
    ]
    vi.stubGlobal('PerformanceObserver', FakePerformanceObserver)
    reported = []
    reporter = (metric) => reported.push(metric)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports TTFB from the navigation entry', () => {
    initPerformanceMetrics(reporter)
    observerFor('navigation').emit([{ responseStart: 321 }])
    expect(reported).toEqual([
      expect.objectContaining({ name: 'TTFB', value: 321, rating: 'good' }),
    ])
  })

  it('reports FCP only for the first-contentful-paint entry', () => {
    initPerformanceMetrics(reporter)
    observerFor('paint').emit([
      { name: 'first-paint', startTime: 100 },
      { name: 'first-contentful-paint', startTime: 150 },
    ])
    expect(reported).toEqual([
      expect.objectContaining({ name: 'FCP', value: 150 }),
    ])
  })

  it('reports the latest LCP candidate and ignores empty batches', () => {
    initPerformanceMetrics(reporter)
    const lcp = observerFor('largest-contentful-paint')
    lcp.emit([])
    expect(reported).toHaveLength(0)
    lcp.emit([{ startTime: 900 }, { startTime: 2600 }])
    expect(reported).toEqual([
      expect.objectContaining({
        name: 'LCP',
        value: 2600,
        rating: 'needs-improvement',
      }),
    ])
  })

  it('accumulates CLS, skipping shifts with recent input', () => {
    initPerformanceMetrics(reporter)
    const shifts = observerFor('layout-shift')
    shifts.emit([
      { value: 0.05, hadRecentInput: false },
      { value: 0.5, hadRecentInput: true },
      { value: 0.07, hadRecentInput: false },
    ])
    expect(reported.map((m) => [m.name, m.value, m.rating])).toEqual([
      ['CLS', 0.05, 'good'],
      ['CLS', 0.12000000000000001, 'needs-improvement'],
    ])
  })

  it('reports INP as the worst interaction so far', () => {
    initPerformanceMetrics(reporter)
    const events = observerFor('event')
    expect(events.observeOptions).toMatchObject({ durationThreshold: 40 })
    events.emit([
      { interactionId: 0, duration: 999 },
      { interactionId: 7, duration: 120 },
      { interactionId: 8, duration: 80 },
      { interactionId: 9, duration: 600 },
    ])
    expect(reported.map((m) => [m.name, m.value, m.rating])).toEqual([
      ['INP', 120, 'good'],
      ['INP', 600, 'poor'],
    ])
  })

  it('keeps the latest value per metric in the snapshot and clears it', () => {
    initPerformanceMetrics(reporter)
    const lcp = observerFor('largest-contentful-paint')
    lcp.emit([{ startTime: 900 }])
    lcp.emit([{ startTime: 1200 }])
    const snapshot = getMetricsSnapshot()
    expect(snapshot).toHaveLength(1)
    expect(snapshot[0]).toMatchObject({ name: 'LCP', value: 1200 })
    clearMetrics()
    expect(getMetricsSnapshot()).toEqual([])
  })

  it('disconnects every observer on cleanup', () => {
    const cleanup = initPerformanceMetrics(reporter)
    cleanup()
    expect(FakePerformanceObserver.instances).toHaveLength(5)
    for (const instance of FakePerformanceObserver.instances) {
      expect(instance.disconnected).toBe(true)
    }
  })

  it('skips entry types the browser does not support', () => {
    FakePerformanceObserver.supportedEntryTypes = ['navigation']
    const cleanup = initPerformanceMetrics(reporter)
    expect(FakePerformanceObserver.instances).toHaveLength(1)
    cleanup()
  })

  it('handles a missing supportedEntryTypes list', () => {
    FakePerformanceObserver.supportedEntryTypes =
      undefined as unknown as string[]
    initPerformanceMetrics(reporter)
    expect(FakePerformanceObserver.instances).toHaveLength(0)
  })

  it('handles observe() throwing', () => {
    vi.stubGlobal(
      'PerformanceObserver',
      class extends FakePerformanceObserver {
        observe(): void {
          throw new Error('not supported')
        }
      }
    )
    const cleanup = initPerformanceMetrics(reporter)
    expect(reported).toEqual([])
    cleanup()
  })

  it('does nothing when PerformanceObserver is unavailable', () => {
    vi.stubGlobal('PerformanceObserver', undefined)
    const cleanup = initPerformanceMetrics(reporter)
    expect(reported).toEqual([])
    cleanup()
  })

  it('uses the console reporter by default', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    initPerformanceMetrics()
    observerFor('navigation').emit([{ responseStart: 100 }])
    expect(debugSpy).toHaveBeenCalledWith('[perf] TTFB: 100 (good)')
    debugSpy.mockRestore()
  })
})

describe('trackInteraction', () => {
  beforeEach(() => {
    clearMetrics()
  })

  it('measures the duration between start and end', () => {
    const nowSpy = vi
      .spyOn(performance, 'now')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1250)
    const reported: PerformanceMetric[] = []
    const end = trackInteraction('save-profile', (m) => reported.push(m))
    expect(end()).toBe(250)
    expect(reported).toEqual([
      expect.objectContaining({
        name: 'interaction:save-profile',
        value: 250,
        rating: 'good',
      }),
    ])
    nowSpy.mockRestore()
  })

  it('uses the console reporter by default', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const nowSpy = vi
      .spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(50)
    trackInteraction('open-modal')()
    expect(debugSpy).toHaveBeenCalledWith(
      '[perf] interaction:open-modal: 50 (good)'
    )
    nowSpy.mockRestore()
    debugSpy.mockRestore()
  })
})
