import * as React from 'react'
import { Text } from 'ui-kit'

// Text's "default"/"muted" tones are light colors designed for the DS's
// dark app background (#030304) — illegible on a plain white page, so the
// preview supplies that background itself (same cause as Skeleton).
const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: '#030304', padding: 24 }}>{children}</div>
)

export const Default = () => (
  <Wrap>
    <Text size="md" tone="default" weight="regular" align="left">
      Reusable ui-kit text component
    </Text>
  </Wrap>
)

export const HeadingLike = () => (
  <Wrap>
    <Text as="strong" size="lg" weight="bold">
      Large bold text for prominent UI labels
    </Text>
  </Wrap>
)

export const MutedHelper = () => (
  <Wrap>
    <Text as="small" size="sm" tone="muted">
      Muted helper text for supplementary information.
    </Text>
  </Wrap>
)

export const Truncated = () => (
  <Wrap>
    <Text as="span" truncate>
      This is a very long line of text that should truncate instead of wrapping to the next line.
    </Text>
  </Wrap>
)
