import { randomBytes } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

const credentialsFile = new URL(
  '../daywise-test-account.local',
  import.meta.url
)
const authEmulator =
  'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:'

async function readCredentials() {
  try {
    return JSON.parse(await readFile(credentialsFile, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    const credentials = {
      email: `daywise-test-${randomBytes(6).toString('hex')}@example.test`,
      password: randomBytes(24).toString('hex'),
    }
    await writeFile(credentialsFile, JSON.stringify(credentials), {
      mode: 0o600,
      flag: 'wx',
    })
    return credentials
  }
}

async function callAuth(action, credentials) {
  return fetch(`${authEmulator}${action}?key=demo-api-key`, {
    method: 'POST',
    redirect: 'error',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...credentials, returnSecureToken: true }),
    signal: AbortSignal.timeout(3_000),
  })
}

try {
  const credentials = await readCredentials()
  let response = await callAuth('signInWithPassword', credentials)
  if (!response.ok) response = await callAuth('signUp', credentials)
  if (!response.ok)
    throw new Error('Firebase Authentication rejected the fixture.')
  console.log(
    'Local emulator account ready. Credentials are in daywise-test-account.local.'
  )
} catch (error) {
  console.error(
    error.cause?.code
      ? `Could not reach the local Firebase Auth emulator (${error.cause.code}).`
      : error.message
  )
  process.exitCode = 1
}
