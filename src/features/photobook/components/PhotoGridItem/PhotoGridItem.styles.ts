import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Card = styled.button`
  display: flex;
  flex-direction: column;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${theme.borderRadius.xl};
  background: ${theme.colors.surface};
  box-shadow: ${theme.boxShadow.card};
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  transition:
    transform ${theme.transition.fast},
    border-color ${theme.transition.fast},
    box-shadow ${theme.transition.fast};

  &:hover {
    transform: translateY(-4px);
    border-color: ${theme.colors.starGlow};
    box-shadow:
      0 12px 28px -12px ${theme.colors.primary}59,
      ${theme.boxShadow.card};
  }
`

export const Thumbnail = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm};
`

export const Caption = styled.p`
  margin: 0;
  color: ${theme.colors.textInverse};
  font-size: ${theme.fontSizes.sm};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.xs};
`
