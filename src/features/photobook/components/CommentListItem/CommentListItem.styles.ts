import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Row = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: flex-start;
`

export const Bubble = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`

export const AuthorName = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.textInverse};
`

export const CommentText = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`

export const ReactionCount = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.muted};
`
