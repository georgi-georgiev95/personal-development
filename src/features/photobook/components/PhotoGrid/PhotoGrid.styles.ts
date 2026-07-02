import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoint.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: ${theme.spacing.sm};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  text-align: center;
  border: 1px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.muted};
`

export const EmptyStateIcon = styled.div`
  color: ${theme.colors.muted};
`

export const EmptyStateTitle = styled.p`
  margin: 0;
  color: ${theme.colors.textInverse};
  font-weight: 600;
  font-size: ${theme.fontSizes.md};
`

export const EmptyStateSubtitle = styled.p`
  margin: 0;
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.sm};
`
