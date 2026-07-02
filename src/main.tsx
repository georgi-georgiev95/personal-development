import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import {
  initPerformanceMetrics,
  consoleReporter,
} from '@/shared/utils/performanceMetrics'
import '@/shared/styles/reset.css'

// Load-speed and interaction metrics (TTFB/FCP/LCP/CLS/INP). Logged to the
// console in dev; collected silently in prod — inspect anytime via
// getMetricsSnapshot(), or swap the reporter for an analytics sink.
initPerformanceMetrics(import.meta.env.DEV ? consoleReporter : () => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
