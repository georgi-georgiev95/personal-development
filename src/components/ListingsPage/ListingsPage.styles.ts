import styled from 'styled-components'
import { theme } from '@/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`

export const PageTitle = styled.h2`
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  font-size: ${theme.fontSizes.xl};

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.lg};
    margin-bottom: ${theme.spacing.md};
  }
`

export const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${theme.spacing.sm};
  }
  cursor: pointer;

  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

export const ListingCard = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${theme.boxShadow.md};
    border-color: ${theme.colors.border};
  }
`

export const ListingImageContainer = styled.div`
  width: 100%;
  background: ${theme.colors.border};
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  min-height: 140px;

  @media (max-width: 480px) {
    aspect-ratio: 4 / 3;
    min-height: 160px;
  }
`

export const PriceBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: ${theme.colors.primary};
  color: white;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: ${theme.fontSizes.sm};
  box-shadow: ${theme.boxShadow.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: ${theme.fontSizes.xs};
    top: ${theme.spacing.xs};
    right: ${theme.spacing.xs};
  }
`

export const ListingImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 220ms ease;

  ${ListingCard}:hover & {
    transform: scale(1.03);
  }
`

export const NoImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textSecondary};
`

export const ListingContent = styled.div`
  padding: ${theme.spacing.sm};
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    padding: ${theme.spacing.md};
  }
`

export const ListingTitle = styled.h3`
  margin: 0 0 ${theme.spacing.xs} 0;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.lg};
  }
`

export const ListingPrice = styled.div`
  font-size: ${theme.fontSizes.lg};
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
  margin-top: 4px;
`

export const ListingDescription = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0 0 ${theme.spacing.sm} 0;
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: ${theme.fontSizes.sm};
  line-height: 1.4;
`

export const ListingMeta = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs};
  margin-top: ${theme.spacing.sm};
`

export const ListingActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: auto;
  justify-content: flex-end;

  button {
    min-width: 36px;
    height: 36px;
    padding: 4px;
    border-radius: 6px;
  }
`

export const PhotosContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
`

export const PhotoPreview = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
`

export const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const RemovePhotoButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${theme.colors.error};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  &:hover {
    opacity: 0.8;
  }
`

export const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 2px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  font-size: 24px;

  &:hover {
    border-color: ${theme.colors.primary};
  }

  input {
    display: none;
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
`

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const ModalContent = styled.div`
  background: ${theme.colors.background};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius};
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;

  @media (max-width: 480px) {
    padding: ${theme.spacing.md};
    width: 95%;
    max-height: 85vh;
  }
`

export const ModalTitle = styled.h3`
  margin: 0 0 ${theme.spacing.md} 0;
  color: ${theme.colors.text};

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.md};
    margin-bottom: ${theme.spacing.sm};
  }
`

export const ModalActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${theme.spacing.lg};

  @media (max-width: 480px) {
    flex-direction: column;
    margin-top: ${theme.spacing.md};
  }
`
