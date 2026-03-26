import { styled } from '@linaria/react'
import { theme } from '@/theme'

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${theme.colors.background};
`

export const WidgetGrid = styled.main`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm};
  }
`

export const WidgetSlot = styled.div`
  position: relative;
  background: ${theme.colors.cardBg};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow.sm};
  overflow: hidden;
  min-width: 0;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;

  &[data-expanded='true'] {
    grid-column: 1 / -1;
    min-height: 400px;
    box-shadow: ${theme.boxShadow.md};
  }
`

export const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.border};
  flex-shrink: 0;
`

export const WidgetBody = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;
`

export const IconButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.border};
  border-radius: 50%;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  line-height: 1;
  transition:
    color 0.15s,
    border-color 0.15s;
`

export const RemoveButton = styled(IconButton)`
  &:hover {
    color: ${theme.colors.error};
    border-color: ${theme.colors.error};
  }
`

export const ExpandButton = styled(IconButton)`
  &:hover {
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
  }
`

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
  text-align: center;
`

export const EmptyStateTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text};
`

export const EmptyStateSubtitle = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
`
