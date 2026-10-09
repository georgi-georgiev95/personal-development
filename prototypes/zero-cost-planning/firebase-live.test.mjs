// Read-only live checks against the isolated Spark project; never production.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createTokenVerifier, readDocument } from './worker.mjs'

test(
  'real Firebase signatures and owner-protected REST reads',
  {
    skip: process.env.PD36_LIVE_TEST_ACK !== 'true',
  },
  async () => {
    const fixture = JSON.parse(
      await readFile(
        new URL('./firebase-fixtures.local.json', import.meta.url),
        'utf8'
      )
    )
    assert.equal(fixture.project, 'pd36-planning-test')
    const tokens = []
    for (const user of fixture.users) {
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${fixture.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: user.refreshToken,
          }),
          signal: AbortSignal.timeout(10_000),
        }
      )
      assert.equal(response.status, 200, 'Test identity refresh failed')
      tokens.push((await response.json()).id_token)
    }
    const verify = createTokenVerifier()
    const [ownerToken, otherToken] = tokens
    const owner = await verify(ownerToken, fixture.project)
    assert.equal(owner, fixture.users[0].localId)
    const path = ['workspaces', owner, 'tasks', 'fixture']
    assert.equal(
      (await readDocument(fixture.project, path, ownerToken))?.id,
      'fixture'
    )
    assert.equal(await readDocument(fixture.project, path, otherToken), null)
    const unauthenticated = { code: 'unauthenticated' }
    await assert.rejects(
      verify(ownerToken.slice(0, -6) + 'AAAAAA', fixture.project),
      unauthenticated
    )
    await assert.rejects(
      verify(ownerToken, fixture.project + '-wrong'),
      unauthenticated
    )
    await assert.rejects(
      verify(ownerToken, fixture.project, Date.now() + 7_200_000),
      unauthenticated
    )
  }
)
