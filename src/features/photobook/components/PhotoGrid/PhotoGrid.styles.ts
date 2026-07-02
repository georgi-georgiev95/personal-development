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

export const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  background: ${theme.colors.surface};
  box-shadow: ${theme.boxShadow.card};
  overflow: hidden;
`

export const SkeletonThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5;

  span {
    width: 100%;
    height: 100%;
  }
`

export const SkeletonMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm};
`

export const SkeletonMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
