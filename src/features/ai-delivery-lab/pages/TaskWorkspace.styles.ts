import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const TaskPage = styled.main`
  width: min(100%, ${theme.layout.containerMaxWidth});
  margin: 0 auto;
  padding: clamp(${theme.spacing.md}, 4vw, ${theme.spacing.xl})
    clamp(${theme.spacing.md}, 5vw, ${theme.spacing.lg});

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: ${theme.spacing.md} ${theme.spacing.sm};
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
  font-size: clamp(2rem, 7vw, 3.5rem);
  line-height: ${theme.lineHeight.tight};
`

export const Notice = styled.p`
  margin: ${theme.spacing.md} 0 0;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.cardBg};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeight.relaxed};
`

export const Content = styled.section`
  display: grid;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`

export const ArtifactPanel = styled.section`
  display: grid;
  gap: ${theme.spacing.md};
  padding: clamp(${theme.spacing.md}, 4vw, ${theme.spacing.lg});
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};

  h2 {
    margin: 0;
    color: ${theme.colors.text};
    font-size: ${theme.fontSizes.lg};
  }

  summary {
    color: ${theme.colors.text};
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
    }
  }
`

export const PlanPanel = styled(ArtifactPanel)`
  width: 100%;
  max-width: 720px;
`

export const PlanDocument = styled.div`
  display: grid;
  gap: ${theme.spacing.lg};
  color: ${theme.colors.text};
  line-height: ${theme.lineHeight.relaxed};
  overflow-wrap: anywhere;

  h3 {
    margin: 0 0 ${theme.spacing.sm};
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSizes.sm};
    font-weight: 600;
  }

  p {
    margin: 0;
    white-space: pre-wrap;
  }

  ol,
  ul {
    display: grid;
    gap: ${theme.spacing.sm};
    margin: 0;
    padding-left: ${theme.spacing.lg};
  }

  ol {
    list-style: decimal;
  }

  ul {
    list-style: disc;
  }

  li::marker {
    color: ${theme.colors.primary};
  }
`

export const ArtifactContent = styled.p`
  margin: 0;
  color: ${theme.colors.text};
  line-height: ${theme.lineHeight.relaxed};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`

export const HandoffPreview = styled.pre`
  margin: 0;
  max-height: 600px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeight.relaxed};

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`

export const ArtifactMeta = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.xs};
  line-height: ${theme.lineHeight.relaxed};
`

export const TaskList = styled.ul`
  display: grid;
  gap: ${theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const TaskCard = styled.li`
  padding: ${theme.spacing.lg};
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
  width: 100%;
  max-width: 720px;
`

export const Field = styled.div`
  display: grid;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};

  label {
    font-weight: 600;
  }
`

export const TextInput = styled.input`
  width: 100%;
  min-height: 44px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.textInverse};
  background: ${theme.colors.cardBg};
  font: inherit;

  &::placeholder {
    color: ${theme.colors.muted};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 1px;
    box-shadow: 0 0 0 4px ${theme.colors.starGlow};
  }
`

export const ValidationSelect = styled.select`
  width: 100%;
  min-height: 44px;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.textInverse};
  background: ${theme.colors.cardBg};
  font: inherit;

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 1px;
    box-shadow: 0 0 0 4px ${theme.colors.starGlow};
  }
`

export const FieldError = styled.p`
  margin: 0;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.errorBg};
  color: ${theme.colors.error};
  line-height: ${theme.lineHeight.relaxed};
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
