import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const Page = styled.div`
  width: min(100%, ${theme.layout.containerMaxWidth});
  margin: 0 auto;
  padding: ${theme.spacing.xl} 56px 80px;

  @media (max-width: 1023px) {
    padding: ${theme.spacing.lg} 40px 64px;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    padding: ${theme.spacing.lg} ${theme.spacing.md} 48px;
  }
`

export const Eyebrow = styled.p`
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const Heading = styled.h1`
  max-width: 760px;
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: ${theme.lineHeight.tight};
  letter-spacing: ${theme.letterSpacing.tight};
`

export const Intro = styled.p`
  max-width: 720px;
  margin: ${theme.spacing.md} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.lg};
  line-height: ${theme.lineHeight.relaxed};
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoint.tablet}) {
    grid-template-columns: 1fr;
  }
`

export const ProjectCard = styled.article<{ $accent: string }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-height: 320px;
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
  border-top: 2px solid ${({ $accent }) => $accent};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
  box-shadow: ${theme.boxShadow.card};
`

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`

export const CardTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xl};
`

export const Status = styled.span<{ $accent: string }>`
  flex-shrink: 0;
  color: ${({ $accent }) => $accent};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const Category = styled.p`
  margin: 0;
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const Description = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  line-height: ${theme.lineHeight.relaxed};
`

export const Purpose = styled.p`
  margin: -${theme.spacing.sm} 0 0;
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeight.relaxed};
`

export const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Tag = styled.li`
  padding: 4px 8px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const Highlights = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  margin: 0;
  padding-left: ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeight.relaxed};
`

export const CardLink = styled(Link)<{ $accent: string }>`
  align-self: flex-start;
  margin-top: auto;
  color: ${({ $accent }) => $accent};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: ${theme.letterSpacing.wide};
  text-decoration: none;

  &:hover {
    color: ${theme.colors.text};
  }
`

export const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm} ${theme.spacing.md};
  align-items: center;
  margin-top: auto;
`

export const ActionLink = styled(Link)<{ $accent: string; $primary?: boolean }>`
  display: inline-block;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${({ $accent }) => $accent};
  border-radius: ${theme.borderRadius.sm};
  color: ${({ $primary }) =>
    $primary ? theme.colors.textOnAccent : theme.colors.text};
  background: ${({ $accent, $primary }) =>
    $primary ? $accent : 'rgba(255, 255, 255, 0.04)'};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  letter-spacing: ${theme.letterSpacing.wide};
  text-decoration: none;
  transition:
    color ${theme.transition.fast},
    background ${theme.transition.fast};

  &:hover {
    color: ${theme.colors.textOnAccent};
    background: ${({ $accent }) => $accent};
  }
`

export const Section = styled.section`
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
`

export const SectionHeading = styled.h2`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xl};
`

export const Prose = styled.div`
  max-width: 760px;
  color: ${theme.colors.textSecondary};
  line-height: ${theme.lineHeight.relaxed};

  p {
    margin: 0 0 ${theme.spacing.md};
  }

  strong {
    color: ${theme.colors.text};
  }
`

export const ProofGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoint.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    grid-template-columns: 1fr;
  }
`

export const ProofItem = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
`

export const ProofLabel = styled.p`
  margin: 0 0 ${theme.spacing.xs};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const ProofValue = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeight.relaxed};
`

export const DetailPage = styled(Page)`
  padding-top: ${theme.spacing.lg};
`

export const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.sm};
  text-decoration: none;

  &:hover {
    color: ${theme.colors.text};
  }
`

export const DemoLink = styled(Link)<{ $accent: string }>`
  display: inline-block;
  margin-top: ${theme.spacing.lg};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${({ $accent }) => $accent};
  border-radius: ${theme.borderRadius.sm};
  color: ${({ $accent }) => $accent};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: ${theme.letterSpacing.wide};
  text-decoration: none;
  text-transform: uppercase;
  transition:
    color ${theme.transition.fast},
    background ${theme.transition.fast};

  &:hover {
    background: ${({ $accent }) => $accent};
    color: ${theme.colors.textOnAccent};
  }
`

export const ProjectLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm} ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`

export const ProjectLink = styled.a`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: ${theme.letterSpacing.wide};
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: ${theme.colors.primary};
  }
`

export const DetailHero = styled.section<{ $accent: string }>`
  padding: ${theme.spacing.xl};
  border: 1px solid ${theme.colors.border};
  border-top: 2px solid ${({ $accent }) => $accent};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};

  @media (max-width: ${theme.breakpoint.tablet}) {
    padding: ${theme.spacing.lg};
  }
`

export const DetailHeading = styled.h2`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xl};
`

export const DetailTitle = styled.h1`
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(2rem, 6vw, 4.5rem);
  line-height: ${theme.lineHeight.tight};
`

export const DetailSection = styled.section`
  max-width: 820px;
  margin-top: ${theme.spacing.xl};
`

export const DetailText = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  line-height: ${theme.lineHeight.relaxed};
  font-size: ${theme.fontSizes.lg};
`

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoint.tablet}) {
    grid-template-columns: 1fr;
  }
`

export const DetailCard = styled.div`
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
`

export const DetailList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin: 0;
  padding-left: ${theme.spacing.lg};
  color: ${theme.colors.textSecondary};
  line-height: ${theme.lineHeight.relaxed};
`
