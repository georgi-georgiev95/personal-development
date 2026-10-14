import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const TaskPage = styled.main`
  width: min(100%, 1040px);
  margin: 0 auto;
  padding: clamp(${theme.spacing.md}, 4vw, ${theme.spacing.xl})
    clamp(${theme.spacing.md}, 5vw, ${theme.spacing.lg});

  @media (max-width: 767px) {
    padding: 24px 20px 32px;
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
  letter-spacing: ${theme.letterSpacing.tight};

  @media (max-width: 767px) {
    max-width: 12ch;
    text-wrap: balance;
    font-size: clamp(2rem, 7.5vw, 2.75rem);
    line-height: 1.12;
  }
`

export const Notice = styled.p`
  display: block;
  width: min(100%, 640px);
  max-width: 100%;
  margin: ${theme.spacing.md} 0 0;
  padding: 0 0 0 12px;
  border-left: 2px solid ${theme.colors.primary};
  color: ${theme.colors.textSecondary};
  font-size: 13px;
  line-height: ${theme.lineHeight.relaxed};
`

export const Content = styled.section`
  display: grid;
  gap: ${theme.spacing.md};
  width: min(100%, 780px);
  margin-top: ${theme.spacing.lg};
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
  gap: ${theme.spacing.lg};
  width: 100%;
  max-width: 780px;
  padding: clamp(20px, 4vw, 32px);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  background: ${theme.colors.surface};
  box-shadow: ${theme.boxShadow.sm};

  textarea.goal-input {
    min-height: 148px;
    padding: 14px 0;
    border: 0;
    border-bottom: 1px solid ${theme.colors.border};
    border-radius: 0;
    background: transparent;
    resize: none;
    font-size: 16px;

    &:focus-visible {
      border-color: ${theme.colors.primary};
      box-shadow: none;
    }
  }

  .goal-field label {
    font-size: ${theme.fontSizes.md};
    font-weight: 600;
  }

  @media (max-width: 767px) {
    gap: 20px;
    padding: 20px;
    border-radius: 12px;

    textarea.goal-input {
      min-height: 120px;
    }

    .goal-field label {
      font-size: 16px;
      line-height: 1.4;
    }

    .form-actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .form-actions button {
      min-height: 48px;
      font-size: 14px;
    }

    .form-actions button + button {
      border: 0;
      color: ${theme.colors.textSecondary};
    }
  }

  .sample-actions button {
    min-height: 32px;
    padding: 0;
    border: 0;
    font-size: 13px;
  }
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
