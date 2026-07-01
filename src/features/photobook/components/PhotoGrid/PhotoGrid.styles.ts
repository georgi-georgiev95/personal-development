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

export const EmptyState = styled.p`
  margin: 0;
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.sm};
`
