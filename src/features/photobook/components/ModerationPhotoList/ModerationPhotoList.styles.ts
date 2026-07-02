import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.cardBg};

  @media (max-width: ${theme.breakpoint.mobile}) {
    flex-wrap: wrap;
  }
`

export const Thumbnail = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.sm};
  flex-shrink: 0;
`

export const Info = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`

export const Caption = styled.span`
  color: ${theme.colors.textInverse};
  font-size: ${theme.fontSizes.sm};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const AuthorLine = styled.span`
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.xs};
`

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  @media (max-width: ${theme.breakpoint.mobile}) {
    width: 100%;
    justify-content: flex-end;
  }
`

export const EmptyState = styled.p`
  margin: 0;
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.sm};
`
