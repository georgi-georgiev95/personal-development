/**
 * Lightweight web-vitals style metrics, built on the native
 * PerformanceObserver API (no external dependency).
 *
 * Tracked automatically via `initPerformanceMetrics()`:
 * - TTFB  — time to first byte (navigation timing)
 * - FCP   — first contentful paint
 * - LCP   — largest contentful paint (latest candidate wins)
 * - CLS   — cumulative layout shift (shifts without recent input)
 * - INP   — worst observed interaction duration
 *
 * Tracked manually: `trackInteraction(name)` for custom interaction spans
 * (e.g. "save-profile", "carousel-navigate").
 */

export type MetricRating = 'good' | 'needs-improvement' | 'poor'

export interface PerformanceMetric {
  name: string
  value: number
  rating: MetricRating
  timestamp: number
}

export type MetricReporter = (metric: PerformanceMetric) => void

interface LayoutShiftEntry extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

// `durationThreshold` (event timing) is newer than the bundled TS DOM lib.
interface ObserverInit extends PerformanceObserverInit {
  durationThreshold?: number
}

// [good, needs-improvement] boundaries from the Web Vitals initiative.
// Values are milliseconds, except CLS which is unitless.
const THRESHOLDS: Record<string, readonly [number, number]> = {
  TTFB: [800, 1800],
  FCP: [1800, 3000],
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
}

export const rateMetric = (name: string, value: number): MetricRating => {
  const thresholds = THRESHOLDS[name]
  if (!thresholds) return 'good'
  if (value <= thresholds[0]) return 'good'
  if (value <= thresholds[1]) return 'needs-improvement'
  return 'poor'
}

const metrics = new Map<string, PerformanceMetric>()

const record = (name: string, value: number, reporter: MetricReporter) => {
  const metric: PerformanceMetric = {
    name,
    value,
    rating: rateMetric(name, value),
    timestamp: Date.now(),
  }
  metrics.set(name, metric)
  reporter(metric)
}

/** Latest value of every metric captured so far. */
export const getMetricsSnapshot = (): PerformanceMetric[] =>
  Array.from(metrics.values())

/** Clears captured metrics (e.g. between soft navigations or tests). */
export const clearMetrics = (): void => {
  metrics.clear()
}

export const consoleReporter: MetricReporter = (metric) => {
  console.debug(
    `[perf] ${metric.name}: ${Math.round(metric.value * 1000) / 1000} (${metric.rating})`
  )
}

const observe = (
  type: string,
  callback: (entries: PerformanceEntry[]) => void,
  options: ObserverInit = {}
): PerformanceObserver | null => {
  if (typeof PerformanceObserver === 'undefined') return null
  if (!PerformanceObserver.supportedEntryTypes?.includes(type)) return null
  try {
    const observer = new PerformanceObserver((list) =>
      callback(list.getEntries())
    )
    observer.observe({ type, buffered: true, ...options })
    return observer
  } catch {
    return null
  }
}

/**
 * Starts observing load-speed and responsiveness metrics. Returns a cleanup
 * function that disconnects every observer.
 */
export const initPerformanceMetrics = (
  reporter: MetricReporter = consoleReporter
): (() => void) => {
  const report = (name: string, value: number) => record(name, value, reporter)

  let clsTotal = 0
  let worstInteraction = 0

  const observers = [
    observe('navigation', (entries) => {
      for (const entry of entries) {
        report('TTFB', (entry as PerformanceNavigationTiming).responseStart)
      }
    }),
    observe('paint', (entries) => {
      for (const entry of entries) {
        if (entry.name === 'first-contentful-paint') {
          report('FCP', entry.startTime)
        }
      }
    }),
    observe('largest-contentful-paint', (entries) => {
      const latest = entries[entries.length - 1]
      if (latest) report('LCP', latest.startTime)
    }),
    observe('layout-shift', (entries) => {
      for (const entry of entries) {
        const shift = entry as LayoutShiftEntry
        if (!shift.hadRecentInput) {
          clsTotal += shift.value
          report('CLS', clsTotal)
        }
      }
    }),
    observe(
      'event',
      (entries) => {
        for (const entry of entries) {
          const event = entry as PerformanceEventTiming
          if (event.interactionId && event.duration > worstInteraction) {
            worstInteraction = event.duration
            report('INP', worstInteraction)
          }
        }
      },
      { durationThreshold: 40 }
    ),
  ]

  return () => {
    for (const observer of observers) {
      observer?.disconnect()
    }
  }
}

/**
 * Measures a custom interaction. Call the returned function when the
 * interaction finishes; it records `interaction:<name>` and returns the
 * duration in milliseconds.
 */
export const trackInteraction = (
  name: string,
  reporter: MetricReporter = consoleReporter
): (() => number) => {
  const start = performance.now()
  return () => {
    const duration = performance.now() - start
    record(`interaction:${name}`, duration, reporter)
    return duration
  }
}
