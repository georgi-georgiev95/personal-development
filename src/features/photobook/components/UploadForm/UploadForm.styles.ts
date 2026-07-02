import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Form = styled.form`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.boxShadow.card};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    background: ${theme.colors.gradient};
    opacity: 0.7;
  }
`

export const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export const PhotoTile = styled.label<{ $hasPreview: boolean }>`
  position: relative;
  flex: 0 0 132px;
  width: 132px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  overflow: hidden;
  background: ${({ $hasPreview }) =>
    $hasPreview ? 'transparent' : 'rgba(45, 212, 191, 0.04)'};
  border: ${({ $hasPreview }) =>
    $hasPreview
      ? `1px solid ${theme.colors.border}`
      : '1px dashed rgba(45, 212, 191, 0.5)'};
`

export const PhotoTilePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const PhotoTileLabel = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  text-align: center;
`

export const PhotoTilePlus = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xl};
  line-height: 1;
`

export const RemovePhotoButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: rgba(3, 3, 4, 0.65);
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  line-height: 1;
  cursor: pointer;
`

export const FormColumn = styled.div`
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

export const CaptionField = styled.div`
  flex: 1;
  display: flex;
`

export const UploadRow = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const ErrorText = styled.p`
  margin: 0;
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xs};
`

export const SignInPrompt = styled.p`
  margin: 0;
  padding: ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  border: 1px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
`
