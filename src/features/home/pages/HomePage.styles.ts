import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

// ─── Layout ─────────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  min-height: calc(100vh - ${theme.layout.navHeight});
  padding: ${theme.spacing.md} 56px;

  @media (max-width: 1023px) {
    min-height: calc(100vh - ${theme.layout.navHeightTablet});
    padding: ${theme.spacing.md} 40px;
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    min-height: calc(100vh - ${theme.layout.navHeightMobile});
    padding: ${theme.spacing.md} ${theme.spacing.md};
    gap: ${theme.spacing.md};
  }
`

// ─── HUD corner brackets ─────────────────────────────────────────────────────

export const HudCorner = styled.div<{ $corner: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: fixed;
  width: 20px;
  height: 20px;
  z-index: 6;
  pointer-events: none;
  top: ${({ $corner }) =>
    $corner === 'tl' || $corner === 'tr' ? '20px' : 'auto'};
  bottom: ${({ $corner }) =>
    $corner === 'bl' || $corner === 'br' ? '20px' : 'auto'};
  left: ${({ $corner }) =>
    $corner === 'tl' || $corner === 'bl' ? '20px' : 'auto'};
  right: ${({ $corner }) =>
    $corner === 'tr' || $corner === 'br' ? '20px' : 'auto'};
  border-top: ${({ $corner }) =>
    $corner === 'tl' || $corner === 'tr'
      ? `1px solid ${theme.colors.border}`
      : 'none'};
  border-bottom: ${({ $corner }) =>
    $corner === 'bl' || $corner === 'br'
      ? `1px solid ${theme.colors.border}`
      : 'none'};
  border-left: ${({ $corner }) =>
    $corner === 'tl' || $corner === 'bl'
      ? `1px solid ${theme.colors.border}`
      : 'none'};
  border-right: ${({ $corner }) =>
    $corner === 'tr' || $corner === 'br'
      ? `1px solid ${theme.colors.border}`
      : 'none'};

  @media (max-width: ${theme.breakpoint.tablet}) {
    display: none;
  }
`

// ─── Main row (headline + feature card) ──────────────────────────────────────

export const MainRow = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xl};
  flex-wrap: wrap;
  padding: ${theme.spacing.md} 0;

  @media (max-width: 1023px) {
    flex-direction: column;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.sm} 0;
  }
`

// ─── Headline ────────────────────────────────────────────────────────────────

export const HeadlineWrap = styled.div`
  flex: 1 1 360px;
  max-width: 440px;
  text-align: left;

  @media (max-width: 1023px) {
    max-width: 480px;
    text-align: center;
    margin: 0 auto;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    max-width: 320px;
  }
`

export const HeroLabel = styled.p`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
  font-weight: 400;
`

export const HeroText = styled.div`
  color: ${theme.colors.text};
  font-weight: 500;
  letter-spacing: ${theme.letterSpacing.tight};
  line-height: ${theme.lineHeight.relaxed};
  font-size: 36px;

  @media (max-width: 1023px) {
    font-size: 26px;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    font-size: 20px;
  }
`

export const HeroCursor = styled.span`
  display: inline-block;
  width: 9px;
  height: 20px;
  background: ${theme.colors.primary};
  margin-left: 4px;
  vertical-align: -3px;
  animation: heroCursorBlink 1.1s step-end infinite;

  @keyframes heroCursorBlink {
    0%,
    45% {
      opacity: 1;
    }
    50%,
    95% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

export const HeroPillsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${theme.spacing.md};
  justify-content: flex-start;

  @media (max-width: 1023px) {
    justify-content: center;
  }
`

export const HeroPill = styled.span`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: 5px 10px;
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

// ─── Feature card ────────────────────────────────────────────────────────────

export const FeatureCardZone = styled.div`
  flex: 0 1 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: 1023px) {
    flex: 1 1 auto;
    width: 100%;
  }
`

export const FeatureCard = styled.div<{ $accent: string }>`
  position: relative;
  width: min(400px, 100%);
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.boxShadow.card};
  transition:
    transform ${theme.transition.normal},
    box-shadow ${theme.transition.normal};

  &:hover {
    transform: translateY(-4px);
  }
`

export const CardGlow = styled.div<{ $accent: string }>`
  position: absolute;
  inset: 0 0 60% 0;
  background: linear-gradient(
    160deg,
    ${({ $accent }) => $accent}33,
    ${theme.colors.background}00 70%
  );
  pointer-events: none;
`

export const CardInner = styled.div`
  position: relative;
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoint.tablet}) {
    padding: ${theme.spacing.md};
  }
`

export const CardBadge = styled.span<{ $accent: string }>`
  display: inline-block;
  color: ${({ $accent }) => $accent};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
  font-weight: 600;
`

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

export const CardTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textInverse};
  font-weight: 700;
  letter-spacing: 0.01em;
  font-size: ${theme.fontSizes.xxl};
`

export const CardDescription = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  line-height: ${theme.lineHeight.relaxed};
  font-size: ${theme.fontSizes.sm};
`

export const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.sm};
`

export const CardTag = styled.span<{ $accent: string }>`
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  font-weight: 600;
  color: ${({ $accent }) => $accent};
`

export const CardViewRouterLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: ${theme.letterSpacing.wide};
  text-decoration: none;
  margin-top: ${theme.spacing.xs};
`

export const AccentArrow = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
`

// ─── Bottom row (sidebar + chat / coordinates + copyright) ──────────────────

export const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 1023px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${theme.spacing.lg};
  }
`

export const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`

export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  align-items: flex-end;

  @media (max-width: 1023px) {
    align-items: flex-start;
  }
`

export const SidebarLabel = styled.p`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin: 0;
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const SidebarLink = styled(Link)`
  margin: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.textSecondary};
  text-decoration: none;
`

export const SidebarLinkArrow = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.muted};
`

export const SidebarLinkTitle = styled.span`
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${theme.colors.primary};
  transition: color ${theme.transition.fast};
`

export const ChatForm = styled.form`
  margin-top: ${theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  width: 300px;
  max-width: 340px;
  background: ${theme.colors.surface};

  @media (max-width: 1023px) {
    width: 100%;
  }
`

export const ChatPrompt = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.md};
`

export const ChatInput = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.md};
  letter-spacing: 0.02em;
  font-family: inherit;

  &:focus-visible {
    outline: 1px solid ${theme.colors.primary};
    outline-offset: 3px;
    border-radius: 2px;
  }

  &::placeholder {
    color: ${theme.colors.muted};
  }
`

export const ChatReply = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.muted};
  max-width: 340px;
  animation: fadeUp ${theme.transition.normal};

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const Coordinates = styled.div`
  text-align: right;
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
  color: ${theme.colors.muted};
  line-height: ${theme.lineHeight.relaxed};

  @media (max-width: 1023px) {
    text-align: left;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    display: none;
  }
`

export const CopyrightText = styled.div`
  font-size: ${theme.fontSizes.sm};
  letter-spacing: 0.06em;
  color: ${theme.colors.muted};
`
