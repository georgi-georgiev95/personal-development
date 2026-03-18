import styled from 'styled-components'
import { theme } from '@/theme'
import { NAVBAR_HEIGHT, NAVBAR_HEIGHT_MOBILE } from '@/components/NavBar.styled'

export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${theme.spacing.md};
  padding-top: calc(${NAVBAR_HEIGHT} + ${theme.spacing.md});
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
    padding-top: calc(${NAVBAR_HEIGHT_MOBILE} + ${theme.spacing.sm});
  }
`

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.primary};
  cursor: pointer;
  margin-bottom: ${theme.spacing.md};
  font-weight: 600;
`

export const PhotoGallery = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
  background: ${theme.colors.cardBg};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow.sm};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing.xs} 0;
  border-bottom: 1px dashed ${theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
`

export const SpecLabel = styled.div`
  font-weight: 600;
  color: ${theme.colors.text};
`

export const SpecValue = styled.div`
  color: ${theme.colors.textSecondary};
  text-align: right;
  font-size: ${theme.fontSizes.sm};
  word-break: break-word;
`

export const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`

export const LightboxImage = styled.img`
  max-width: 95%;
  max-height: 90%;
  object-fit: contain;
  border-radius: ${theme.borderRadius};
`

export const MainPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow.sm};
`

export const SidePhotos = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

export const SidePhoto = styled.img`
  width: 100%;
  height: calc((100% - ${theme.spacing.sm}) / 2);
  object-fit: cover;
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow.sm};
`

export const Title = styled.h2`
  margin: ${theme.spacing.md} 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.text};
`

export const Price = styled.div`
  color: ${theme.colors.primary};
  font-weight: 700;
  font-size: ${theme.fontSizes.xl};
`

export const Description = styled.p`
  color: ${theme.colors.textSecondary};
  line-height: 1.5;
`

export const Meta = styled.div`
  margin-top: ${theme.spacing.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
`

export const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`

export default null
