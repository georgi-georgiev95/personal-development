import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'

const assets = await readdir('dist/assets')
for (const file of assets.filter((name) => name.endsWith('.js'))) {
  const code = await readFile(`dist/assets/${file}`, 'utf8')
  for (const marker of [
    'demo-pd-28',
    'demo-api-key',
    'http://127.0.0.1:9099',
  ]) {
    assert.ok(
      !code.includes(marker),
      `Emulator activation in production: ${file} (${marker})`
    )
  }
  assert.ok(
    !/["']127\.0\.0\.1["'],\s*8080/.test(code),
    `Firestore emulator activation in production: ${file}`
  )
}
assert.ok(
  assets.some((name) => name.endsWith('.js')),
  'Build assets are missing'
)
console.info('Production assets exclude emulator activation.')
