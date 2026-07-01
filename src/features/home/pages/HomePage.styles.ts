import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

// ─── Layout ─────────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  height: calc(100vh - ${theme.layout.navHeight});
  padding: ${theme.spacing.lg} 56px;
  overflow: hidden;

  @media (max-width: 1023px) {
    height: calc(100vh - ${theme.layout.navHeightTablet});
    padding: ${theme.spacing.md} 40px;
    gap: clamp(12px, 2.5vh, 40px);
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    height: calc(100vh - ${theme.layout.navHeightMobile});
    padding: 16px ${theme.spacing.md};
    gap: clamp(8px, 2vh, 32px);
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
      ? '1px solid rgba(255, 255, 255, 0.25)'
      : 'none'};
  border-bottom: ${({ $corner }) =>
    $corner === 'bl' || $corner === 'br'
      ? '1px solid rgba(255, 255, 255, 0.25)'
      : 'none'};
  border-left: ${({ $corner }) =>
    $corner === 'tl' || $corner === 'bl'
      ? '1px solid rgba(255, 255, 255, 0.25)'
      : 'none'};
  border-right: ${({ $corner }) =>
    $corner === 'tr' || $corner === 'br'
      ? '1px solid rgba(255, 255, 255, 0.25)'
      : 'none'};

  @media (max-width: ${theme.breakpoint.tablet}) {
    display: none;
  }
`

// ─── Main row (headline + card stack + scroll hint) ─────────────────────────

export const MainRow = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  perspective: 1400px;

  @media (max-width: 1023px) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    gap: clamp(8px, 2vh, 32px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    gap: clamp(6px, 1.5vh, 24px);
  }
`

// ─── Headline ────────────────────────────────────────────────────────────────

export const HeadlineWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  max-width: 440px;
  text-align: left;

  @media (max-width: 1023px) {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    max-width: 480px;
    text-align: center;
    margin: 0 auto;
    flex: 0 0 auto;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    max-width: 320px;
  }
`

export const HeroLabel = styled.p`
  margin: 0 0 16px;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 400;
`

export const HeroText = styled.div`
  color: ${theme.colors.text};
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.32;
  font-size: 36px;

  @media (max-width: 1023px) {
    font-size: 28px;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    font-size: 21px;
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
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 28px;
  justify-content: flex-start;

  @media (max-width: 1023px) {
    justify-content: center;
  }
`

export const HeroPill = styled.span`
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  padding: 5px 10px;
  color: rgba(255, 255, 255, 0.55);
  font-size: ${theme.fontSizes.xs};
  letter-spacing: 1px;
  text-transform: uppercase;
`

// ─── Card stack ──────────────────────────────────────────────────────────────

export const CarouselZone = styled.div`
  position: absolute;
  inset: 0;

  @media (max-width: 1023px) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(8px, 2vh, 32px);
  }
`

export const StackWrap = styled.div<{ $tiltX: number; $tiltY: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(360px, 30vw);
  height: min(480px, 100%);
  overflow: hidden;
  will-change: transform;
  touch-action: none;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%) rotateX(${({ $tiltX }) => $tiltX}deg)
    rotateY(${({ $tiltY }) => $tiltY}deg);

  @media (max-width: 1023px) {
    position: relative;
    top: auto;
    left: auto;
    margin: 0 auto;
    flex: 0 0 auto;
    width: min(300px, 78vw);
    height: min(400px, 44vh);
    transform: rotateX(${({ $tiltX }) => $tiltX}deg)
      rotateY(${({ $tiltY }) => $tiltY}deg);
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    width: min(248px, 72vw);
    height: min(340px, 40vh);
  }
`

export const CardStage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`

export const ProjectCard = styled.div<{ $delta: number; $accent: string }>`
  --spiral-step: 92%;
  position: absolute;
  inset: 0;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  background: ${theme.colors.surface};
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.7);
  cursor: ${({ $delta }) => ($delta === 0 ? 'default' : 'pointer')};
  transition:
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.6s ease;
  transform: translateY(calc(var(--spiral-step) * ${({ $delta }) => $delta}))
    rotateX(${({ $delta }) => $delta * -12}deg)
    scale(${({ $delta }) => 1 - Math.abs($delta) * 0.1});
  opacity: ${({ $delta }) => {
    const distance = Math.abs($delta)
    if (distance === 0) return 1
    if (distance === 1) return 0.45
    if (distance === 2) return 0.16
    return 0
  }};
  z-index: ${({ $delta }) => 50 - Math.abs($delta) * 10};
  pointer-events: ${({ $delta }) => ($delta === 0 ? 'auto' : 'none')};
`

export const CardGlow = styled.div<{ $accent: string }>`
  position: absolute;
  inset: 0 0 55% 0;
  background: linear-gradient(
    160deg,
    ${({ $accent }) => $accent}33,
    #05070880 70%
  );
`

export const CardInner = styled.div`
  position: absolute;
  inset: 0;
  padding: 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 1023px) {
    padding: 22px;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    padding: 18px;
  }
`

export const CardBadge = styled.span<{ $accent: string }>`
  display: inline-block;
  color: ${({ $accent }) => $accent};
  font-size: 12px;
  letter-spacing: 0.14em;
  font-weight: 600;
`

export const CardBody = styled.div``

export const CardTitle = styled.h2`
  margin: 0 0 12px;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.01em;
  font-size: 24px;

  @media (max-width: 1023px) {
    font-size: 21px;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    font-size: 18px;
  }
`

export const CardDescription = styled.p`
  margin: 0 0 20px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.55;
  font-size: 13px;

  @media (max-width: 1023px) {
    font-size: 12.5px;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    font-size: 11.5px;
  }
`

export const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
`

export const CardTag = styled.span<{ $accent: string }>`
  font-size: 10px;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: ${({ $accent }) => $accent};
`

export const CardViewLink = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  letter-spacing: 0.1em;
`

export const AccentArrow = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
`

// ─── Card pager (top right) ─────────────────────────────────────────────────

export const CardNav = styled.div`
  position: fixed;
  top: 50px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 20;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 2px;
  padding: 6px 12px;

  @media (max-width: ${theme.breakpoint.tablet}) {
    top: 58px;
    right: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    top: 50px;
    right: ${theme.spacing.sm};
    padding: 4px 10px;
  }
`

export const NavArrow = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.55);
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  font-family: inherit;
  padding: 2px 6px;
  letter-spacing: 1.32px;
  transition: color ${theme.transition.fast};

  &:hover {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.xs};
    padding: 2px 4px;
  }
`

export const NavCounter = styled.span`
  color: rgba(255, 255, 255, 0.85);
  font-size: ${theme.fontSizes.sm};
  letter-spacing: 0.16em;
  text-align: center;
  font-weight: 400;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.xs};
    letter-spacing: 1.2px;
  }
`

export const PagerTitle = styled.span`
  @media (max-width: ${theme.breakpoint.mobile}) {
    display: none;
  }
`

// ─── Scroll hint ─────────────────────────────────────────────────────────────

export const ScrollHintWrap = styled.div`
  position: absolute;
  left: 50%;
  top: calc(50% + min(240px, 40%) + 20px);
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 280px;

  @media (max-width: 1023px) {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }
`

export const ScrollHintText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.4);
  font-size: ${theme.fontSizes.xs};
  letter-spacing: 1.6px;
  text-transform: uppercase;
`

export const ScrollArrow = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: ${theme.fontSizes.md};
  animation: bounceDown 2s ease-in-out infinite;

  @keyframes bounceDown {
    0%,
    100% {
      transform: translateY(0px);
      opacity: 0.35;
    }
    50% {
      transform: translateY(6px);
      opacity: 0.9;
    }
  }
`

export const ScrollTicksRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 4px;
`

export const ScrollTick = styled.span<{ $active: boolean; $color: string }>`
  width: ${({ $active }) => ($active ? '22px' : '12px')};
  height: 2px;
  border-radius: 1px;
  background: ${({ $active, $color }) =>
    $active ? $color : 'rgba(255, 255, 255, 0.4)'};
  transition: all 0.3s ease;
`

// ─── Bottom row (sidebar + chat / coordinates + copyright) ──────────────────

export const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 1023px) {
    flex-direction: column;
    align-items: stretch;
    gap: 28px;
  }
`

export const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-end;

  @media (max-width: 1023px) {
    align-items: flex-start;
  }
`

export const SidebarLabel = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  font: inherit;
  cursor: default;
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;

  @media (max-width: 1023px) {
    cursor: pointer;
    width: 100%;
    justify-content: space-between;
  }
`

export const SidebarChevron = styled.span<{ $open: boolean }>`
  display: none;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  transition: transform 0.25s ease;

  @media (max-width: 1023px) {
    display: inline-block;
  }
`

export const SidebarFilters = styled.ul<{ $open: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 1023px) {
    overflow: hidden;
    max-height: ${({ $open }) => ($open ? '360px' : '0px')};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transition:
      max-height 0.3s ease,
      opacity 0.25s ease;
  }
`

export const SidebarFilter = styled.li`
  margin: 0;
  padding: 0;
`

export const SidebarLink = styled.a<{ $active: boolean }>`
  margin: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 11px;
  cursor: pointer;
  text-decoration: none;
  user-select: none;
`

export const SidebarLinkArrow = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
`

export const SidebarLinkIndex = styled.span<{
  $active: boolean
  $color: string
}>`
  font-size: 11px;
  color: ${({ $active, $color }) =>
    $active ? $color : 'rgba(255, 255, 255, 0.4)'};
  transition: color ${theme.transition.fast};
`

export const SidebarLinkTitle = styled.span<{
  $active: boolean
  $color: string
}>`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${({ $active, $color }) =>
    $active ? $color : 'rgba(255, 255, 255, 0.4)'};
  transition: color ${theme.transition.fast};
`

export const ChatForm = styled.form`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  padding: 10px 14px;
  width: 300px;
  max-width: 340px;
  background: rgba(255, 255, 255, 0.02);

  @media (max-width: 1023px) {
    width: 100%;
  }
`

export const ChatPrompt = styled.span`
  color: ${theme.colors.primary};
  font-size: 13px;
`

export const ChatInput = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.02em;
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }
`

export const ChatReply = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  max-width: 340px;
  animation: fadeUp 0.3s ease;

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
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.7;

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
  color: rgba(255, 255, 255, 0.4);
`
