import { describe, expect, it, vi } from 'vitest'
import { generateOpenAIPlan } from '../src/openAIProvider.js'
import type { PlanGenerationInput } from '../src/planning.js'

const input: PlanGenerationInput = {
  title: 'Improve onboarding',
  goal: 'Make first use clear.',
  contextEntries: [{ name: 'README', content: 'Use the existing router.' }],
  contextRevision: 4,
}

const success = (content: string) =>
  new Response(
    JSON.stringify({
      choices: [{ message: { content, refusal: null } }],
    }),
    { status: 200 }
  )

describe('generateOpenAIPlan', () => {
  it('uses a fixed model, strict schema, untrusted-context prompt, and parses structured output', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      success(
        JSON.stringify({
          objective: 'Improve first use.',
          steps: ['Review the flow.', 'Implement the change.'],
          acceptanceCriteria: ['First use is clear.'],
          risks: [],
        })
      )
    )
    const result = await generateOpenAIPlan(
      input,
      'server-only-secret',
      fetcher
    )
    const [, options] = fetcher.mock.calls[0]
    const body = JSON.parse(String(options?.body))

    expect(fetcher).toHaveBeenCalledOnce()
    expect(fetcher.mock.calls[0][0]).toBe(
      'https://api.openai.com/v1/chat/completions'
    )
    expect(options?.headers).toMatchObject({
      Authorization: 'Bearer server-only-secret',
    })
    expect(body).toMatchObject({
      model: 'gpt-4.1-mini',
      max_completion_tokens: 1_200,
      response_format: {
        type: 'json_schema',
        json_schema: { strict: true, name: 'delivery_plan' },
      },
    })
    expect(body.messages[0].content).toContain('untrusted reference data')
    expect(body.messages[1].content).toContain('Use the existing router.')
    expect(result).toMatchObject({ objective: 'Improve first use.' })
  })

  it('does not call a provider without a configured key', async () => {
    const fetcher = vi.fn<typeof fetch>()
    await expect(generateOpenAIPlan(input, '', fetcher)).rejects.toMatchObject({
      code: 'unavailable',
    })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('maps provider timeout and non-success responses without exposing provider details', async () => {
    const timeoutFetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new DOMException('secret diagnostic', 'TimeoutError'))
    await expect(
      generateOpenAIPlan(input, 'key', timeoutFetcher)
    ).rejects.toMatchObject({
      code: 'deadline-exceeded',
      message: 'Plan generation timed out. Try again.',
    })

    const failedFetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response('private provider diagnostic', { status: 429 })
      )
    await expect(
      generateOpenAIPlan(input, 'key', failedFetcher)
    ).rejects.toMatchObject({
      code: 'unavailable',
      message: 'The planning provider is temporarily unavailable.',
    })
  })

  it('rejects refusals and malformed provider data', async () => {
    const refusalFetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: null, refusal: 'refused' } }],
        }),
        {
          status: 200,
        }
      )
    )
    await expect(
      generateOpenAIPlan(input, 'key', refusalFetcher)
    ).rejects.toMatchObject({
      code: 'failed-precondition',
    })

    const malformedFetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(success('{'))
    await expect(
      generateOpenAIPlan(input, 'key', malformedFetcher)
    ).rejects.toMatchObject({
      code: 'unavailable',
    })
  })
})
