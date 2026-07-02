#!/usr/bin/env node
/**
 * Performance budget gate.
 *
 * Measures the gzipped weight of everything the browser downloads for the
 * initial page load (the entry script, its modulepreloaded chunks, and
 * stylesheets referenced from dist/index.html) and fails the build when a
 * budget is exceeded.
 *
 * Run after `pnpm build`:  pnpm perf
 *
 * If this gate fails after you add a dependency or feature:
 *   1. Prefer lazy-loading it (dynamic import / React.lazy) so it stays out
 *      of the initial chunk.
 *   2. If it cannot be deferred, do NOT raise the budget silently — flag it
 *      to the project owner and decide together.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { gzipSync } from 'node:zlib'

// Budgets in gzipped kilobytes. Baseline (2026-07-02): initial JS ~137 KB,
// initial CSS ~3 KB, largest async chunk (three.js) ~236 KB.
const BUDGETS = {
  initialJsGzipKb: 170,
  initialCssGzipKb: 12,
  asyncChunkGzipKb: 260,
}

const distDir = resolve(process.cwd(), 'dist')
const indexHtmlPath = join(distDir, 'index.html')

let indexHtml
try {
  indexHtml = readFileSync(indexHtmlPath, 'utf8')
} catch {
  console.error(
    `✗ perf-budget: ${indexHtmlPath} not found — run \`pnpm build\` first.`
  )
  process.exit(1)
}

const gzipKb = (assetPath) => {
  const contents = readFileSync(join(distDir, assetPath))
  return gzipSync(contents).length / 1024
}

const collect = (regex) =>
  [...indexHtml.matchAll(regex)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('/assets/'))
    .map((href) => href.slice(1))

const initialJs = [
  ...collect(/<script[^>]+src="([^"]+)"/g),
  ...collect(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g),
]
const initialCss = collect(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)

const sum = (paths) => paths.reduce((total, p) => total + gzipKb(p), 0)

const initialJsKb = sum(initialJs)
const initialCssKb = sum(initialCss)

// Largest chunk that is NOT part of the initial load (lazy/async chunks).
const initialSet = new Set(initialJs)
let largestAsync = { name: 'none', kb: 0 }
for (const file of readdirSync(join(distDir, 'assets'))) {
  const assetPath = `assets/${file}`
  if (!file.endsWith('.js') || initialSet.has(assetPath)) continue
  const kb = gzipKb(assetPath)
  if (kb > largestAsync.kb) largestAsync = { name: file, kb }
}

const rows = [
  {
    label: 'Initial JS (entry + modulepreload)',
    actual: initialJsKb,
    budget: BUDGETS.initialJsGzipKb,
    files: initialJs,
  },
  {
    label: 'Initial CSS',
    actual: initialCssKb,
    budget: BUDGETS.initialCssGzipKb,
    files: initialCss,
  },
  {
    label: `Largest async chunk (${largestAsync.name})`,
    actual: largestAsync.kb,
    budget: BUDGETS.asyncChunkGzipKb,
    files: [],
  },
]

let failed = false
console.log('Performance budget (gzipped):')
for (const row of rows) {
  const status = row.actual <= row.budget ? '✓' : '✗'
  if (row.actual > row.budget) failed = true
  console.log(
    `  ${status} ${row.label}: ${row.actual.toFixed(1)} KB (budget ${row.budget} KB)`
  )
  for (const file of row.files) {
    console.log(`      - ${file} (${gzipKb(file).toFixed(1)} KB)`)
  }
}

if (failed) {
  console.error(
    '\n✗ Performance budget exceeded. The initial load got slower.\n' +
      '  Lazy-load the new code (dynamic import / React.lazy) or remove it.\n' +
      '  Do not raise the budget without flagging it to the project owner.'
  )
  process.exit(1)
}

console.log('\n✓ All performance budgets pass.')
