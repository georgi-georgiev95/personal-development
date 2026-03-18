import styled from 'styled-components'
import { theme } from '@/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.md};
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`

export const FormTitle = styled.h2`
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  font-size: ${theme.fontSizes.xl};

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.lg};
    margin-bottom: ${theme.spacing.md};
  }
`

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};

  @media (max-width: 480px) {
    margin-bottom: ${theme.spacing.sm};
  }
`

export const PhotosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};

  @media (max-width: 480px) {
    gap: ${theme.spacing.xs};
  }
`

export const PhotoPreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`

export const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const RemovePhotoButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${theme.colors.error};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover {
    opacity: 0.8;
  }
`

export const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 2px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  transition: border-color 0.2s;

  &:hover {
    border-color: ${theme.colors.primary};
  }

  input {
    display: none;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`

export const SuccessMessage = styled.div`
  padding: ${theme.spacing.md};
  background: ${theme.colors.success};
  color: white;
  border-radius: ${theme.borderRadius};
  text-align: center;
  margin-bottom: ${theme.spacing.md};

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.sm};
  }
`

export const TagWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
  transition:
    box-shadow 160ms ease,
    border-color 160ms ease;

  &:hover {
    border-color: ${theme.colors.primary};
  }

  &:focus-within {
    box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.08);
    border-color: ${theme.colors.primary};
  }
`

export const TagChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1;
`
