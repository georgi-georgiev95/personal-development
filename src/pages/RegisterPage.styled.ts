import { styled } from '@linaria/react'
import { theme } from '@/theme'

export const StyledRegisterBox = styled.div`
  min-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
  overflow: hidden;
`

export const StyledRegisterCard = styled.div`
  padding: ${theme.spacing.lg};
  width: 380px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);

  @media (max-width: 768px) {
    width: 90vw;
    padding: ${theme.spacing.md};
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    width: 98vw;
    padding: ${theme.spacing.sm};
    border-radius: 8px;
  }
`

export const StyledTitle = styled.h2`
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  color: #2575fc;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 500;
  font-size: ${theme.fontSizes.xl};

  @media (max-width: 768px) {
    font-size: ${theme.fontSizes.lg};
  }

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.md};
  }
`
