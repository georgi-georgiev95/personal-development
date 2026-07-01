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
