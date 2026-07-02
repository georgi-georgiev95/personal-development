import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  background: ${theme.colors.surface};
  box-shadow: ${theme.boxShadow.card};
  overflow: hidden;
`

export const CardButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition:
    transform ${theme.transition.fast},
    box-shadow ${theme.transition.fast};

  &:hover {
    box-shadow:
      0 12px 28px -12px ${theme.colors.primary}59,
      ${theme.boxShadow.card};
  }
`

export const Thumbnail = styled.img`
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
`

export const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: rgba(3, 3, 4, 0.65);
  color: #fda4af;
  cursor: pointer;
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
  font-size: 12.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${theme.fontSizes.xs};
`

export const AuthorName = styled.span<{ $isOwner: boolean }>`
  color: ${({ $isOwner }) =>
    $isOwner ? theme.colors.primary : 'rgba(255, 255, 255, 0.5)'};
`

export const CountsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.muted};
`

export const CountItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`
