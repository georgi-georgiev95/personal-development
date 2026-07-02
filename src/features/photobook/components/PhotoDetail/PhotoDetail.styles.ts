import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Title = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.textInverse};
`

export const FullImage = styled.img`
  width: 100%;
  max-height: 50vh;
  object-fit: contain;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
`

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  max-height: 30vh;
  overflow-y: auto;
`

export const SignInHint = styled.p`
  margin: 0;
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.sm};
`

export const UploaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`

export const UploaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`

export const UploaderName = styled.span<{ $isOwner: boolean }>`
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ $isOwner }) =>
    $isOwner ? theme.colors.primary : 'rgba(255, 255, 255, 0.5)'};
`

export const LikeActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`

export const ReactionCount = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.muted};
`
