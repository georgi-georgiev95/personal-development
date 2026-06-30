import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

// ─── Layout ─────────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
`

// ─── Left Sidebar ────────────────────────────────────────────────────────────

export const Sidebar = styled.aside`
  position: absolute;
  left: ${theme.spacing.lg};
  bottom: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 10;

  @media (max-width: 1023px) {
    left: ${theme.spacing.md};
    bottom: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    display: none;
  }
`

export const SidebarLabel = styled.p`
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`

export const SidebarFilters = styled.ul`
  list-style: none;
  margin: 0 0 ${theme.spacing.md};
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const SidebarFilter = styled.li`
  margin: 0;
  padding: 0;
`

export const SidebarLink = styled.a<{ $active: boolean }>`
  margin: 0;
  padding: 0;
  display: inline-block;
  color: ${({ $active }) =>
    $active ? theme.colors.starPrimary : 'rgba(255, 255, 255, 0.48)'};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  transition: color ${theme.transition.fast};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  user-select: none;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`

export const AskButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 8px 20px;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color ${theme.transition.fast},
    color ${theme.transition.fast};
  width: fit-content;

  &:hover {
    border-color: rgba(255, 255, 255, 0.45);
    color: rgba(255, 255, 255, 0.82);
  }
`

// ─── Card Carousel ───────────────────────────────────────────────────────────

export const CarouselArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const CardStage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1400px;
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
`

type ProjectCardProps = {
  $offset: number
  $colorFrom: string
  $colorTo: string
  $accent: string
}

export const ProjectCard = styled.div<ProjectCardProps>`
  position: absolute;
  width: 340px;
  height: 480px;
  border-radius: ${theme.borderRadius.lg};
  background: linear-gradient(
    145deg,
    ${({ $colorFrom }) => $colorFrom} 0%,
    ${({ $colorTo }) => $colorTo} 100%
  );
  border: 1px solid ${({ $accent }) => $accent}3a;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 ${({ $accent }) => $accent}22;
  cursor: ${({ $offset }) => ($offset === 0 ? 'default' : 'pointer')};
  transition:
    transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.45s ease,
    filter 0.45s ease;
  transform: perspective(1400px)
    translateX(
      ${({ $offset }) => {
        const angle = $offset * 0.72
        return Math.sin(angle) * 270
      }}px
    )
    translateY(
      ${({ $offset }) => {
        return $offset * 220
      }}px
    )
    translateZ(
      ${({ $offset }) => {
        const angle = $offset * 0.72
        return -120 - Math.abs($offset) * 185 + Math.cos(angle) * 40
      }}px
    )
    rotateY(
      ${({ $offset }) => {
        return Math.sin($offset * 0.72) * 26 - 8
      }}deg
    )
    rotateX(
      ${({ $offset }) => {
        return -Math.sign($offset) * Math.min(Math.abs($offset) * 6, 16)
      }}deg
    )
    scale(
      ${({ $offset }) => {
        const abs = Math.abs($offset)
        if (abs === 0) return 1
        if (abs === 1) return 0.8
        if (abs === 2) return 0.64
        return 0.5
      }}
    );
  opacity: ${({ $offset }) => {
    const abs = Math.abs($offset)
    if (abs === 0) return 1
    if (abs === 1) return 0.56
    if (abs === 2) return 0.3
    return 0
  }};
  filter: ${({ $offset }) => {
    const abs = Math.abs($offset)
    if (abs === 0) return 'blur(0px)'
    if (abs === 1) return 'blur(1px)'
    if (abs === 2) return 'blur(2.2px)'
    return 'blur(3px)'
  }};
  z-index: ${({ $offset }) => Math.max(10 - Math.abs($offset) * 3, 0)};
  pointer-events: ${({ $offset }) =>
    Math.abs($offset) <= 2 ? 'auto' : 'none'};

  @media (max-width: 1023px) {
    width: 300px;
    height: 420px;
    transform: perspective(1200px)
      translateX(${({ $offset }) => Math.sin($offset * 0.72) * 220}px)
      translateY(${({ $offset }) => $offset * 180}px)
      translateZ(
        ${({ $offset }) =>
          -100 - Math.abs($offset) * 155 + Math.cos($offset * 0.72) * 34}px
      )
      rotateY(
        ${({ $offset }) => {
          return Math.sin($offset * 0.72) * 22 - 8
        }}deg
      )
      rotateX(
        ${({ $offset }) => {
          return -Math.sign($offset) * Math.min(Math.abs($offset) * 5, 14)
        }}deg
      )
      scale(
        ${({ $offset }) => {
          const abs = Math.abs($offset)
          if (abs === 0) return 1
          if (abs === 1) return 0.78
          if (abs === 2) return 0.62
          return 0.5
        }}
      );
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    width: 260px;
    height: 360px;
    transform: perspective(1000px)
      translateX(${({ $offset }) => Math.sin($offset * 0.72) * 176}px)
      translateY(${({ $offset }) => $offset * 144}px)
      translateZ(
        ${({ $offset }) =>
          -80 - Math.abs($offset) * 130 + Math.cos($offset * 0.72) * 28}px
      )
      rotateY(
        ${({ $offset }) => {
          return Math.sin($offset * 0.72) * 19 - 8
        }}deg
      )
      rotateX(
        ${({ $offset }) => {
          return -Math.sign($offset) * Math.min(Math.abs($offset) * 4, 12)
        }}deg
      )
      scale(
        ${({ $offset }) => {
          const abs = Math.abs($offset)
          if (abs === 0) return 1
          if (abs === 1) return 0.76
          if (abs === 2) return 0.6
          return 0.48
        }}
      );
  }
`

export const CardInner = styled.div`
  position: absolute;
  inset: 0;
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  border-radius: inherit;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.07) 0%,
      transparent 55%
    );
    border-radius: inherit;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.35), transparent);
    border-radius: inherit;
    pointer-events: none;
  }
`

export const CardBadge = styled.span<{ $accent: string }>`
  display: inline-block;
  color: ${({ $accent }) => $accent};
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: auto;
  position: relative;
  z-index: 1;
`

export const CardTitle = styled.h2`
  margin: auto 0 ${theme.spacing.sm};
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);

  @media (max-width: ${theme.breakpoint.tablet}) {
    font-size: 1.15rem;
  }
`

export const CardDescription = styled.p`
  margin: 0 0 ${theme.spacing.md};
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.875rem;
  line-height: 1.6;
  position: relative;
  z-index: 1;

  @media (max-width: ${theme.breakpoint.tablet}) {
    font-size: 0.8rem;
  }
`

export const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  position: relative;
  z-index: 1;
`

export const CardTag = styled.span<{ $accent: string }>`
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid ${({ $accent }) => $accent}55;
  color: ${({ $accent }) => $accent};
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
`

// ─── Card Navigation ─────────────────────────────────────────────────────────

export const CardNav = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: ${theme.borderRadius.md};
  padding: 5px 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  @media (max-width: ${theme.breakpoint.mobile}) {
    top: ${theme.spacing.sm};
    right: ${theme.spacing.sm};
    padding: 4px 10px;
  }
`

export const NavArrow = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.62);
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  font-family: inherit;
  padding: 2px 6px;
  letter-spacing: 0.04em;
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
  color: rgba(255, 255, 255, 0.82);
  font-size: ${theme.fontSizes.sm};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  min-width: 110px;
  text-align: center;
  font-weight: 500;

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.xs};
    min-width: 80px;
  }
`
