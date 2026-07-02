import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const PageWrapper = styled.div`
  width: 100%;
  max-width: ${theme.layout.containerMaxWidth};
  margin: 0 auto;
  padding: ${theme.spacing.lg};
  padding-top: calc(${theme.layout.navHeight} + ${theme.spacing.lg});
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoint.tablet}) {
    padding: ${theme.spacing.md};
    padding-top: calc(${theme.layout.navHeightTablet} + ${theme.spacing.md});
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: ${theme.spacing.sm};
    padding-top: calc(${theme.layout.navHeightMobile} + ${theme.spacing.sm});
  }
`

export const PageHeader = styled.div`
  text-align: center;
`

export const PageEyebrow = styled.p`
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.secondary};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 400;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.01em;
  font-size: 28px;
  color: ${theme.colors.textInverse};
`

export const PageSubtitle = styled.p`
  margin: ${theme.spacing.sm} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`

// ─── Game layout ─────────────────────────────────────────────────────────────

export const GameLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
`

export const StatsRow = styled.div`
  width: min(440px, 100%);
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  &:last-child {
    text-align: right;
  }
`

export const StatLabel = styled.span`
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const StatValue = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
`

// ─── Board + overlay ─────────────────────────────────────────────────────────

export const BoardShell = styled.div`
  position: relative;
  width: min(440px, 100%);
  /* Swiping the board steers the snake — never scrolls the page. */
  touch-action: none;
`

export const BoardOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  text-align: center;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.overlay};
  pointer-events: none;
`

export const OverlayTitle = styled.p`
  margin: 0;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
  text-shadow: 0 0 18px ${theme.colors.starGlow};
`

export const OverlayNote = styled.p`
  margin: 0;
  color: ${theme.colors.secondary};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
`

export const OverlayHint = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`

// ─── Controls + hints ────────────────────────────────────────────────────────

export const ControlsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`

export const HintLine = styled.p`
  margin: 0;
  max-width: min(440px, 100%);
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeight.relaxed};
  text-align: center;
`

export const Key = styled.kbd`
  display: inline-block;
  padding: 1px 6px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-family: inherit;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
`

/** Visible only on devices with a keyboard-friendly (fine) pointer. */
export const KeyboardHint = styled.span`
  display: inline;

  @media (pointer: coarse) {
    display: none;
  }
`

/** Visible only on touch-first (coarse pointer) devices. */
export const TouchHint = styled.span`
  display: none;

  @media (pointer: coarse) {
    display: inline;
  }
`
