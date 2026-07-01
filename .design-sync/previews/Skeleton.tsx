import * as React from 'react'
import { Skeleton } from 'ui-kit'

// The shimmer is a translucent white overlay (rgba(255,255,255,0.06-0.14))
// designed to sit on the DS's dark app background (#030304) — invisible on
// a plain white page, so the preview supplies that background itself.
const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: '#030304', padding: 24 }}>{children}</div>
)

export const Text = () => (
  <Wrap>
    <Skeleton variant="text" width="160px" />
  </Wrap>
)

export const Circle = () => (
  <Wrap>
    <Skeleton variant="circle" width="40px" height="40px" />
  </Wrap>
)

export const Rect = () => (
  <Wrap>
    <Skeleton variant="rect" width="220px" height="80px" />
  </Wrap>
)
