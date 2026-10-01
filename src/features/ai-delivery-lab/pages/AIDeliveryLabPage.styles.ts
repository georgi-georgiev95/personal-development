import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const DetailPage = styled.main`
  width: min(100%, ${theme.layout.containerMaxWidth});
  margin: 0 auto;
  padding: ${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xl};
  }
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

export const Eyebrow = styled.p`
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const SimulatedNote = styled.p`
  display: inline-block;
  margin: 0 0 ${theme.spacing.md};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.muted};
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

export const ResetButton = styled.button`
  display: block;
  margin: ${theme.spacing.md} 0;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  font: inherit;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: ${theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`

export const DetailText = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  line-height: ${theme.lineHeight.relaxed};
  font-size: ${theme.fontSizes.lg};
`

export const DetailHeading = styled.h3`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xl};
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

export const StageGrid = styled.div`
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

export const StageButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  min-height: 96px;
  padding: ${theme.spacing.md};
  border: 1px solid
    ${({ $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text};
  background: ${({ $active }) =>
    $active ? 'rgba(45, 212, 191, 0.12)' : theme.colors.surface};
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${theme.transition.fast},
    background ${theme.transition.fast};

  &:hover,
  &:focus-visible {
    border-color: ${theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`

export const StageName = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
`

export const StageStatus = styled.span<{
  $status: 'complete' | 'active' | 'pending'
}>`
  color: ${({ $status }) =>
    $status === 'complete'
      ? theme.colors.success
      : $status === 'active'
        ? theme.colors.primary
        : theme.colors.muted};
  font-size: ${theme.fontSizes.xs};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const StageDetails = styled.div`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
`
