import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const TaskPage = styled.main`
  width: min(100%, ${theme.layout.containerMaxWidth});
  margin: 0 auto;
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: ${theme.spacing.md};
  }
`

export const Breadcrumb = styled(Link)`
  display: inline-block;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.sm};
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: ${theme.colors.primary};
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
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: ${theme.lineHeight.tight};
`

export const Notice = styled.p`
  margin: ${theme.spacing.md} 0 0;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-left: 2px solid ${theme.colors.primary};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeight.relaxed};
`

export const Content = styled.section`
  display: grid;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`

export const TaskList = styled.ul`
  display: grid;
  gap: ${theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const TaskCard = styled.li`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
`

export const TaskLink = styled(Link)`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }
`

export const TaskMeta = styled.p`
  margin: ${theme.spacing.sm} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeight.relaxed};
`

export const TaskForm = styled.form`
  display: grid;
  gap: ${theme.spacing.md};
  max-width: 720px;
`

export const Field = styled.div`
  display: grid;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
`

export const TextInput = styled.input`
  width: 100%;
  min-height: 44px;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.textInverse};
  background: ${theme.colors.cardBg};
  font: inherit;

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`

export const FieldError = styled.p`
  margin: 0;
  color: ${theme.colors.error};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.sm};
`

export const Stage = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  text-transform: capitalize;
`

export const StageProgress = styled.ol`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const StageChoice = styled.button<{ $selected: boolean }>`
  display: grid;
  width: 100%;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm};
  border: 1px solid
    ${({ $selected }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`

export const StageActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`
