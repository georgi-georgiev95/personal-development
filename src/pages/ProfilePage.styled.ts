import styled from 'styled-components'
import { theme } from '../theme'

export const StyledProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 5vh);
  background: ${theme.colors.gradient};
  padding: 5rem 2rem 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem 1.5rem;
  }
  @media (max-width: 480px) {
    padding: 4rem 1rem 1rem;
  }
`

export const StyledProfileCard = styled.div`
  background: ${theme.colors.navbar};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow.md};
  padding: ${theme.spacing.md};
  max-width: 600px;
  width: 100%;

  @media (max-width: 768px) {
    padding: ${theme.spacing.lg};
  }
  @media (max-width: 480px) {
    padding: ${theme.spacing.md};
  }
`

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`

export const ProfilePhotoContainer = styled.div`
  position: relative;
  margin-bottom: ${theme.spacing.md};
`

export const ProfilePhoto = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${theme.colors.primary};

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`

export const DefaultProfileIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid ${theme.colors.primary};

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`

export const UploadButton = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background: ${theme.colors.secondary};
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${theme.boxShadow.sm};
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
  }
`

export const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`

export const DetailLabel = styled.span`
  font-weight: 600;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.md};

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.sm};
  }
`

export const DetailValue = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.md};

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.sm};
  }
`
